export function _queue(max = 4) {
	if (!max) max = 4
	const item_a1 = [] as queue_item_type[]
	let pending = 0
	let closed = false
	let closed_fulfil
	function dequeue() {
		if (!pending && !item_a1.length) {
			if (closed_fulfil)
				closed_fulfil()
		}
		if (pending >= max) return
		if (!item_a1.length) return
		pending += 1
		const { fn, fulfil, reject } = item_a1.shift() as queue_item_type
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
		add(fn) {
			if (closed) {
				throw new Error('Cannot add to a closed queue')
			}
			return new Promise((fulfil, reject)=>{
				item_a1.push({ fn, fulfil, reject })
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
/**
 * Rate limit function factory.
 * @link {@see https://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/}
 */
export function _rate_limit(ops_max:number, interval:number, allow_bursts = false) {
	const max_rate = allow_bursts ? ops_max : ops_max / interval
	let ops_num = 0
	let start = new Date().getTime()
	const queue_a1 = [] as rate_limit_fn_type[]
	function rate_limit(fn) {
		let rate = 0
		const now = new Date().getTime()
		const elapsed = now - start
		if (elapsed > interval) {
			ops_num = 0
			start = now
		}
		rate = ops_num / (allow_bursts ? 1 : elapsed)
		return new Promise(async (resolve, reject)=>{
			try {
				if (rate < max_rate) {
					if (queue_a1.length) {
						if (fn) queue_a1.push(async ()=>resolve(await fn()))
						ops_num += 1
						;(queue_a1.shift() as rate_limit_fn_type)().then()
					} else {
						ops_num += 1
						resolve(await fn())
					}
				} else {
					if (fn) queue_a1.push(async ()=>resolve(await fn()))
					setTimeout(rate_limit, 1 / max_rate)
				}
			} catch (err) {
				reject(err)
			}
		})
	}
	return rate_limit
}
export type rate_limit_fn_type = ()=>Promise<void>
export type queue_item_type = {
	fn
	fulfil
	reject
}
