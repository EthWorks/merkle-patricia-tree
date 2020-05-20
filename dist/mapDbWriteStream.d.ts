import { MapDb } from './mapDb';
import { StreamChunk } from './model/StreamChunk';
declare const Writable: any;
export declare class MapDbWriteStream extends Writable {
    private readonly db;
    constructor(db: MapDb);
    _write({ key, value }: StreamChunk, encoding: string, callback: () => void): Promise<void>;
}
export {};
