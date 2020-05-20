"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkpointTrie_1 = require("./checkpointTrie");
const secure_1 = require("./secure");
const ethereumjs_util_1 = require("ethereumjs-util");
function wrapEmptyPromise(promise, cb) {
    return promise.then(() => {
        cb === null || cb === void 0 ? void 0 : cb(null);
    }, (err) => {
        if (cb) {
            cb(err);
        }
        else {
            throw err;
        }
    });
}
function wrapPromise(promise, cb) {
    return promise.then((value) => {
        cb === null || cb === void 0 ? void 0 : cb(null, value);
        return value;
    }, (err) => {
        if (cb) {
            cb(err, null);
            return undefined;
        }
        else {
            throw err;
        }
    });
}
class WrappedCheckpointTrie extends checkpointTrie_1.CheckpointTrie {
    static async prove(trie, key, cb) {
        return wrapPromise(checkpointTrie_1.CheckpointTrie.prove(trie, ethereumjs_util_1.toBuffer(key)), cb);
    }
    static async verifyProof(rootHash, key, proofNodes, cb) {
        return checkpointTrie_1.CheckpointTrie.verifyProof(ethereumjs_util_1.toBuffer(rootHash), ethereumjs_util_1.toBuffer(key), proofNodes).then((value) => {
            if (value === null) {
                cb === null || cb === void 0 ? void 0 : cb(new Error('verifyProof failed'), null);
            }
            else {
                cb === null || cb === void 0 ? void 0 : cb(null, value);
            }
            return value;
        }, (err) => {
            if (cb) {
                cb(err, null);
                return undefined;
            }
            else {
                throw err;
            }
        });
    }
    async get(key, cb) {
        return wrapPromise(super.get(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async put(key, value, cb) {
        return wrapEmptyPromise(super.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb);
    }
    async del(key, cb) {
        return wrapEmptyPromise(super.del(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async getRaw(key, cb) {
        return wrapPromise(this._mainDB.get(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async putRaw(key, value, cb) {
        return wrapEmptyPromise(this._mainDB.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb);
    }
    async delRaw(key, cb) {
        return wrapEmptyPromise(this._mainDB.del(ethereumjs_util_1.toBuffer(key)), cb);
    }
    copy(includeCheckpoints = true) {
        const db = this._mainDB.copy();
        const trie = new WrappedCheckpointTrie(db, this.root);
        if (includeCheckpoints && this.isCheckpoint) {
            trie._checkpoints = this._checkpoints.slice();
            trie._scratch = this._scratch.copy();
            trie.db = trie._scratch;
        }
        return trie;
    }
    async checkRoot(root, cb) {
        return wrapPromise(super.checkRoot(ethereumjs_util_1.toBuffer(root)), cb).then((value) => !!value);
    }
    async commit(cb) {
        return wrapEmptyPromise(super.commit(), cb);
    }
    async revert(cb) {
        return wrapEmptyPromise(super.revert(), cb);
    }
    async batch(ops, cb) {
        return wrapEmptyPromise(super.batch(ops), cb);
    }
    createScratchReadStream(scratchDb) {
        return super._createScratchReadStream(scratchDb);
    }
}
exports.CheckpointTrie = WrappedCheckpointTrie;
class WrappedSecureTrie extends secure_1.SecureTrie {
    static async prove(trie, key, cb) {
        return wrapPromise(secure_1.SecureTrie.prove(trie, ethereumjs_util_1.toBuffer(key)), cb);
    }
    static async verifyProof(rootHash, key, proofNodes, cb) {
        return secure_1.SecureTrie.verifyProof(ethereumjs_util_1.toBuffer(rootHash), ethereumjs_util_1.toBuffer(key), proofNodes).then((value) => {
            if (value === null) {
                cb === null || cb === void 0 ? void 0 : cb(new Error('verifyProof failed'), null);
            }
            else {
                cb === null || cb === void 0 ? void 0 : cb(null, value);
            }
            return value;
        }, (err) => {
            if (cb) {
                cb(err, null);
                return undefined;
            }
            else {
                throw err;
            }
        });
    }
    async get(key, cb) {
        return wrapPromise(super.get(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async put(key, value, cb) {
        return wrapEmptyPromise(super.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb);
    }
    async del(key, cb) {
        return wrapEmptyPromise(super.del(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async getRaw(key, cb) {
        return wrapPromise(this._mainDB.get(ethereumjs_util_1.toBuffer(key)), cb);
    }
    async putRaw(key, value, cb) {
        return wrapEmptyPromise(this._mainDB.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb);
    }
    async delRaw(key, cb) {
        return wrapEmptyPromise(this._mainDB.del(ethereumjs_util_1.toBuffer(key)), cb);
    }
    copy() {
        const db = this._mainDB.copy();
        return new WrappedSecureTrie(db, this.root);
    }
    async checkRoot(root, cb) {
        return wrapPromise(super.checkRoot(ethereumjs_util_1.toBuffer(root)), cb).then((value) => !!value);
    }
    async commit(cb) {
        return wrapEmptyPromise(super.commit(), cb);
    }
    async revert(cb) {
        return wrapEmptyPromise(super.revert(), cb);
    }
    async batch(ops, cb) {
        return wrapEmptyPromise(super.batch(ops), cb);
    }
    createScratchReadStream(scratchDb) {
        return super._createScratchReadStream(scratchDb);
    }
}
exports.SecureTrie = WrappedSecureTrie;
//# sourceMappingURL=wrappers.js.map