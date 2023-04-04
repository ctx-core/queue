const default_queue_size = 4
/**
 * @param queue_size
 * @returns {queue_T}
 * @private
 */
export function queue_(queue_size = default_queue_size) {
	if (!queue_size) queue_size = default_queue_size
	const item_a = []
	let pending = 0
	let closed = false
	let closed_resolve
	let cancelled = false
	return /** @type {queue_T} */{
		add(fn) {
			if (closed) {
				throw new Error('Cannot add to a closed queue')
			}
			return new Promise((resolve, reject)=>{
				item_a.push({ fn, resolve, reject })
				dequeue()
			})
		},
		close() {
			closed = true
			return new Promise((resolve)=>{
				if (pending) {
					closed_resolve = resolve
				} else {
					resolve(null)
				}
			})
		},
		cancel() {
			closed = true
			cancelled = true
			return pending
		},
		get pending() {
			return pending
		}
	}
	function dequeue() {
		if (cancelled) return
		if (!pending && !item_a.length) {
			if (closed_resolve) closed_resolve(null)
		}
		if (pending >= queue_size) return
		if (!item_a.length) return
		pending++
		const { fn, resolve, reject } = item_a.shift()
		const promise = fn()
		try {
			promise
				.then($res=>{
					if (!cancelled) return resolve($res)
				}, $rej=>{
					if (!cancelled) return reject($rej)
				})
				.then(()=>{
					if (!cancelled) pending--
					dequeue()
				})
		} catch (err) {
			reject(err)
			pending--
			dequeue()
		}
		dequeue()
	}
}
export { queue_ as _queue, }
