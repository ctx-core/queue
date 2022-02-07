export declare function queue_<Out extends unknown = unknown>(max?:number):queue_T<Out>;
export interface queue_T<Out extends unknown = unknown> {
	add(fn:()=>Promise<Out>):Promise<Out>;
	close():Promise<unknown>;
}
export interface queue_item_T {
	fn:()=>Promise<any>;
	fulfil:(v:any)=>void;
	reject:(err:any)=>void;
}
export { queue_ as _queue, }
