"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const checkpointTrie_1 = require("./checkpointTrie");
/**
 * You can create a secure Trie where the keys are automatically hashed
 * using **keccak256** by using `require('merkle-patricia-tree/secure')`.
 * It has the same methods and constructor as `Trie`.
 * @class SecureTrie
 * @extends Trie
 * @public
 */
class SecureTrie extends checkpointTrie_1.CheckpointTrie {
    constructor(...args) {
        super(...args);
    }
    static prove(trie, key) {
        const hash = ethereumjs_util_1.keccak256(key);
        return super.prove(trie, hash);
    }
    static async verifyProof(rootHash, key, proof) {
        const hash = ethereumjs_util_1.keccak256(key);
        return super.verifyProof(rootHash, hash, proof);
    }
    copy() {
        const trie = super.copy(false);
        const db = trie.db.copy();
        return new SecureTrie(db, this.root);
    }
    async get(key) {
        const hash = ethereumjs_util_1.keccak256(key);
        const value = await super.get(hash);
        return value;
    }
    /**
     * For a falsey value, use the original key
     * to avoid double hashing the key.
     */
    async put(key, val) {
        if (!val || val.toString() === '') {
            await this.del(key);
        }
        else {
            const hash = ethereumjs_util_1.keccak256(key);
            await super.put(hash, val);
        }
    }
    async del(key) {
        const hash = ethereumjs_util_1.keccak256(key);
        await super.del(hash);
    }
}
exports.SecureTrie = SecureTrie;
//# sourceMappingURL=secure.js.map