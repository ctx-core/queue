export declare function _queue(max?: number): {
    add<Out extends unknown = unknown>(fn: () => Promise<Out>): Promise<Out>;
    close(): Promise<unknown>;
};
export interface queue_item_type {
    fn: () => Promise<any>;
    fulfil: (v: any) => void;
    reject: (err: any) => void;
}
