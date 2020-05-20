/// <reference types="node" />
import { LevelUp } from 'levelup';
export declare const ENCODING_OPTS: {
    keyEncoding: string;
    valueEncoding: string;
};
export declare type BatchDBOp = PutBatch | DelBatch;
export interface PutBatch {
    type: 'put';
    key: Buffer;
    value: Buffer;
}
export interface DelBatch {
    type: 'del';
    key: Buffer;
}
/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export declare class DB {
    _leveldb: LevelUp;
    /**
     * Initialize a DB instance. If `leveldb` is not provided, DB
     * defaults to an [in-memory store](https://github.com/Level/memdown).
     * @param {Object} [leveldb] - An abstract-leveldown compliant store
     */
    constructor(leveldb?: LevelUp);
    /**
     * Retrieves a raw value from leveldb.
     * @param {Buffer} key
     * @returns {Promise} - Promise resolves with `Buffer` if a value is found or `null` if no value is found.
     */
    get(key: Buffer): Promise<Buffer | null>;
    /**
     * Writes a value directly to leveldb.
     * @param {Buffer} key The key as a `Buffer`
     * @param {Buffer} value The value to be stored
     * @returns {Promise}
     */
    put(key: Buffer, val: Buffer): Promise<void>;
    /**
     * Removes a raw value in the underlying leveldb.
     * @param {Buffer} key
     * @returns {Promise}
     */
    del(key: Buffer): Promise<void>;
    /**
     * Performs a batch operation on db.
     * @param {Array} opStack A stack of levelup operations
     * @returns {Promise}
     */
    batch(opStack: BatchDBOp[]): Promise<void>;
    /**
     * Returns a copy of the DB instance, with a reference
     * to the **same** underlying leveldb instance.
     */
    copy(): DB;
}
