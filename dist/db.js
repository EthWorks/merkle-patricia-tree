"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const level = require('level-mem');
exports.ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' };
/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
class DB {
    /**
     * Initialize a DB instance. If `leveldb` is not provided, DB
     * defaults to an [in-memory store](https://github.com/Level/memdown).
     * @param {Object} [leveldb] - An abstract-leveldown compliant store
     */
    constructor(leveldb) {
        this._leveldb = leveldb || level();
    }
    /**
     * Retrieves a raw value from leveldb.
     * @param {Buffer} key
     * @returns {Promise} - Promise resolves with `Buffer` if a value is found or `null` if no value is found.
     */
    async get(key) {
        let value = null;
        try {
            value = await this._leveldb.get(key, exports.ENCODING_OPTS);
        }
        catch (error) {
            if (error.notFound) {
                // not found, returning null
            }
            else {
                throw error;
            }
        }
        finally {
            return value;
        }
    }
    /**
     * Writes a value directly to leveldb.
     * @param {Buffer} key The key as a `Buffer`
     * @param {Buffer} value The value to be stored
     * @returns {Promise}
     */
    async put(key, val) {
        await this._leveldb.put(key, val, exports.ENCODING_OPTS);
    }
    /**
     * Removes a raw value in the underlying leveldb.
     * @param {Buffer} key
     * @returns {Promise}
     */
    async del(key) {
        await this._leveldb.del(key, exports.ENCODING_OPTS);
    }
    /**
     * Performs a batch operation on db.
     * @param {Array} opStack A stack of levelup operations
     * @returns {Promise}
     */
    async batch(opStack) {
        await this._leveldb.batch(opStack, exports.ENCODING_OPTS);
    }
    /**
     * Returns a copy of the DB instance, with a reference
     * to the **same** underlying leveldb instance.
     */
    copy() {
        return new DB(this._leveldb);
    }
}
exports.DB = DB;
//# sourceMappingURL=db.js.map