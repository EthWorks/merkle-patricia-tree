/// <reference types="node" />
import { CheckpointTrie } from './checkpointTrie';
/**
 * You can create a secure Trie where the keys are automatically hashed
 * using **keccak256** by using `require('merkle-patricia-tree/secure')`.
 * It has the same methods and constructor as `Trie`.
 * @class SecureTrie
 * @extends Trie
 * @public
 */
export declare class SecureTrie extends CheckpointTrie {
    constructor(...args: any);
    static prove(trie: SecureTrie, key: Buffer): Promise<Buffer[]>;
    static verifyProof(rootHash: Buffer, key: Buffer, proof: Buffer[]): Promise<Buffer | null>;
    copy(): SecureTrie;
    get(key: Buffer): Promise<Buffer | null>;
    /**
     * For a falsey value, use the original key
     * to avoid double hashing the key.
     */
    put(key: Buffer, val: Buffer): Promise<void>;
    del(key: Buffer): Promise<void>;
}
