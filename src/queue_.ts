export function queue_(max = 4) {
	if (!max) max = 4
	const item_a:queue_item_type[] = []
	let pending = 0
	let closed = false
	let closed_fulfil:(v:any)=>void
	function dequeue() {
		if (!pending && !item_a.length) {
			if (closed_fulfil)
				closed_fulfil(null)
		}
		if (pending >= max) return
		if (!item_a.length) return
		pending += 1
		const { fn, fulfil, reject } = item_a.shift() as queue_item_type
		const promise = fn()
		try {
			promise.then(fulfil, reject).then(()=>{
				pending -= 1
				dequeue()
			})
		} catch (err) {
			reject(err)
			pending -= 1
			dequeue()
		}
		dequeue()
	}
	return {
		add<Out extends unknown = unknown>(fn:()=>Promise<Out>):Promise<Out> {
			if (closed) {
				throw new Error('Cannot add to a closed queue')
			}
			return new Promise((fulfil, reject)=>{
				item_a.push({ fn, fulfil, reject })
				dequeue()
			})
		},
		close() {
			closed = true
			return new Promise(fulfil=>{
				if (pending) {
					closed_fulfil = fulfil
				} else {
					fulfil(null)
				}
			})
		}
	}
}
export interface queue_item_type {
	fn:()=>Promise<any>
	fulfil:(v:any)=>void
	reject:(err:any)=>void
}
export {
	queue_ as _queue,
}
