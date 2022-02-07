/** @type {import('queue_.d.ts').queue_} */
export const queue_ = (max = 4)=>{
	if (!max) max = 4
	const item_a = []
	let pending = 0
	let closed = false
	let closed_fulfil
	return {
		add(fn) {
			if (closed) {
				throw new Error('Cannot add to a closed queue')
			}
			return new Promise((fulfil, reject)=>{
				item_a.push({
					fn,
					fulfil,
					reject
				})
				dequeue()
			})
		},
		close() {
			closed = true
			return new Promise((fulfil)=>{
				if (pending) {
					closed_fulfil = fulfil
				} else {
					fulfil(null)
				}
			})
		}
	}
	function dequeue() {
		if (!pending && !item_a.length) {
			if (closed_fulfil) closed_fulfil(null)
		}
		if (pending >= max) return
		if (!item_a.length) return
		pending += 1
		const { fn, fulfil, reject } = item_a.shift()
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
}
export { queue_ as _queue, }
