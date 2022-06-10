import { promise_o_ } from '@ctx-core/function'
import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { queue_ } from '../index.js'
test('queue_(1).add|queue length of 1 at a time', async ()=>{
	const queue = queue_(1)
	const promise_o_a = [promise_o_(), promise_o_(), promise_o_()]
	const ret_a:any[] = [null, null, null]
	queue.add(()=>promise_o_a[0].promise).then(ret=>ret_a[0] = ret)
	queue.add(()=>promise_o_a[1].promise).then(ret=>ret_a[1] = ret)
	queue.add(()=>promise_o_a[2].promise).then(ret=>ret_a[2] = ret)
	equal(ret_a, [null, null, null])
	promise_o_a[1].resolve('val1')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, [null, null, null])
	promise_o_a[0].resolve('val0')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', null, null])
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', 'val1', null])
	promise_o_a[2].resolve('val2')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', 'val1', 'val2'])
})
test('queue_(2).add|queue length of 2 at a time', async ()=>{
	const queue = queue_(2)
	const promise_o_a = [promise_o_(), promise_o_(), promise_o_(), promise_o_()]
	const ret_a:any[] = [null, null, null, null]
	queue.add(()=>promise_o_a[0].promise).then(ret=>ret_a[0] = ret)
	queue.add(()=>promise_o_a[1].promise).then(ret=>ret_a[1] = ret)
	queue.add(()=>promise_o_a[2].promise).then(ret=>ret_a[2] = ret)
	queue.add(()=>promise_o_a[3].promise).then(ret=>ret_a[3] = ret)
	equal(ret_a, [null, null, null, null])
	promise_o_a[2].resolve('val2')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, [null, null, null, null])
	promise_o_a[3].resolve('val3')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, [null, null, null, null])
	promise_o_a[0].resolve('val0')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', null, null, null])
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', null, 'val2', null])
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', null, 'val2', 'val3'])
	promise_o_a[1].resolve('val1')
	await new Promise(res=>queueMicrotask(()=>res(null)))
	equal(ret_a, ['val0', 'val1', 'val2', 'val3'])
})
test.run()
