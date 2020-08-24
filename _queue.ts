export function _queue(max=4) {
	if (!max) max = 4
	const item_a1 = []
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
		const { fn, fulfil, reject } = item_a1.shift()
		const promise = fn()
		try {
			promise.then(fulfil, reject).then(() => {
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
			return new Promise((fulfil, reject) => {
				item_a1.push({ fn, fulfil, reject })
				dequeue()
			})
		},
		close() {
			closed = true
			return new Promise(fulfil => {
				if (pending) {
					closed_fulfil = fulfil
				} else {
					fulfil()
				}
			})
		}
	}
}
/**
 * Rate limit function factory.
 * @param {number}max__ops - Maximum number of ops per inverval
 * @param {number}interval - The time to count ops
 * @param {boolean}allow__bursts - Allow bursts of ops or space ops along interval
 * @returns {function(*=): Promise<unknown>}
 * @link {@see https://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/}
 */
export function _rate_limit(max__ops, interval, allow__bursts = false) {
	const max_rate = allow__bursts ? max__ops : max__ops / interval
	let ops_num = 0
	let start = new Date().getTime()
	const queue = []
	function rate_limit(fn) {
		let rate = 0
		const now = new Date().getTime()
		const elapsed = now - start
		if (elapsed > interval) {
			ops_num = 0
			start = now
		}
		rate = ops_num / (allow__bursts ? 1 : elapsed)
		return new Promise(async (resolve, reject) => {
			try {
				if (rate < max_rate) {
					if (queue.length) {
						if (fn) queue.push(async() => resolve(await fn()))
						ops_num += 1
						queue.shift()()
					} else {
						ops_num += 1
						resolve(await fn())
					}
				} else {
					if (fn) queue.push(async() => resolve(await fn()))
					setTimeout(rate_limit, 1 / max_rate)
				}
			} catch (err) {
				reject(err)
			}
		})
	}
	return rate_limit
}
