export declare function queue_(queue_size?:number):queue_T
export interface queue_T {
	add<Out>(fn:()=>Promise<Out>):Promise<Out>
	close():Promise<unknown>
	cancel():number
}
export interface queue_item_T {
	fn:()=>Promise<any>
	fulfil:(v:any)=>void
	reject:(err:any)=>void
}
export { queue_ as _queue, }
