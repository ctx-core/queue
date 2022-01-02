/**
 * Rate limit function factory.
 * @type {import('rate_limit_').rate_limit_}
 * @link {@see https://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/}
 */
export const rate_limit_ = (ops_max, interval, allow_bursts = false)=>{
	const max_rate = allow_bursts ? ops_max : ops_max / interval
	let ops_num = 0
	let start = new Date().getTime()
	const queue_a = []
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
					if (queue_a.length) {
						if (fn) queue_a.push(async ()=>resolve(await fn())
						)
						ops_num += 1
						queue_a.shift()().then()
					} else {
						ops_num += 1
						resolve(await fn())
					}
				} else {
					if (fn) queue_a.push(async ()=>resolve(await fn())
					)
					setTimeout(rate_limit, 1 / max_rate)
				}
			} catch (err) {
				reject(err)
			}
		})
	}
	return rate_limit
}
export { rate_limit_ as _rate_limit, }
