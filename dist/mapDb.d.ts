/// <reference types="node" />
import { BatchDbOp } from './model/BatchDbOp';
export declare class MapDb {
    protected _map: Map<string, Buffer>;
    constructor(map?: Map<string, Buffer>);
    get(key: Buffer): Promise<Buffer | null>;
    put(key: Buffer, val: Buffer): Promise<void>;
    del(key: Buffer): Promise<void>;
    batch(opStack: BatchDbOp[]): Promise<void>;
    /**
     * Returns a copy of the MapDb instance, with a reference
     * to the **same** underlying Map instance.
     */
    copy(): MapDb;
}
