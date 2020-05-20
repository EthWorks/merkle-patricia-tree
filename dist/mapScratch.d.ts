/// <reference types="node" />
import { MapDb } from './mapDb';
export declare class MapScratchDb extends MapDb {
    private readonly _upstream;
    constructor(_upstream: MapDb);
    get(key: Buffer): Promise<Buffer | null>;
    /**
     * Returns a copy of the MapScratchDb instance, with a reference
     * to the **same** underlying Map and upstream MapDb instances.
     */
    copy(): MapScratchDb;
    toMapDb(): MapDb;
}
