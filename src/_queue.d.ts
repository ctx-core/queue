export declare function _queue(max?: number): {
    add(fn: any): Promise<unknown>;
    close(): Promise<unknown>;
};
export interface queue_item_type {
    fn: any;
    fulfil: any;
    reject: any;
}
