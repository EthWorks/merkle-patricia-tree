"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
/**
 * An in-memory wrap over `DB` with an upstream DB
 * which will be queried when a key is not found
 * in the in-memory scratch. This class is used to implement
 * checkpointing functionality in CheckpointTrie.
 */
class ScratchDB extends db_1.DB {
    constructor(upstreamDB) {
        super();
        this._upstream = upstreamDB;
    }
    /**
     * Similar to `DB.get`, but first searches in-memory
     * scratch DB, if key not found, searches upstream DB.
     */
    async get(key) {
        let value = null;
        // First, search in-memory db
        try {
            value = await this._leveldb.get(key, db_1.ENCODING_OPTS);
        }
        catch (error) {
            if (error.notFound) {
                // not found, returning null
            }
            else {
                throw error;
            }
        }
        // If not found, try searching upstream db
        if (!value && this._upstream._leveldb) {
            try {
                value = await this._upstream._leveldb.get(key, db_1.ENCODING_OPTS);
            }
            catch (error) {
                if (error.notFound) {
                    // not found, returning null
                }
                else {
                    throw error;
                }
            }
        }
        return value;
    }
    copy() {
        const scratch = new ScratchDB(this._upstream);
        scratch._leveldb = this._leveldb;
        return scratch;
    }
}
exports.ScratchDB = ScratchDB;
//# sourceMappingURL=scratch.js.map