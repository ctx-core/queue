/**
 * Rate limit function factory.
 * @link {@see https://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/}
 */
export declare function rate_limit_(ops_max:number, interval:number, allow_bursts?:boolean):rate_limit__T;
export declare type rate_limit__T = (fn:rate_limit_fn_T)=>Promise<void>;
export declare type rate_limit_fn_T = ()=>Promise<void>;
export { rate_limit_ as _rate_limit, }
