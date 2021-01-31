/**
 * Rate limit function factory.
 * @link {@see https://www.matteoagosti.com/blog/2013/01/22/rate-limiting-function-calls-in-javascript/}
 */
export declare function _rate_limit(ops_max: number, interval: number, allow_bursts?: boolean): (fn: any) => Promise<unknown>;
export declare type rate_limit_fn_type = () => Promise<void>;
