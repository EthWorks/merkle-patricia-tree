/// <reference types="node" />
import { CheckpointTrie } from './checkpointTrie';
import { SecureTrie } from './secure';
import { BaseTrie } from './index';
import { BatchDbOp } from './model/BatchDbOp';
import { MapScratchDb } from './mapScratch';
declare type Callback<T> = (err: any, value: T) => void;
declare class WrappedCheckpointTrie extends CheckpointTrie {
    static prove(trie: BaseTrie, key: Buffer | string, cb?: Callback<Buffer[] | null>): Promise<Buffer[]>;
    static verifyProof(rootHash: Buffer | string, key: Buffer | string, proofNodes: Buffer[], cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    get(key: Buffer | string, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    put(key: Buffer | string, value: Buffer | string, cb?: Callback<void>): Promise<void>;
    del(key: Buffer | string, cb?: Callback<void>): Promise<void>;
    getRaw(key: Buffer, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    putRaw(key: Buffer | string, value: Buffer, cb?: Callback<void>): Promise<void>;
    delRaw(key: Buffer, cb?: Callback<void>): Promise<void>;
    copy(includeCheckpoints?: boolean): WrappedCheckpointTrie;
    checkRoot(root: Buffer, cb?: Callback<boolean | null>): Promise<boolean>;
    commit(cb?: Callback<void>): Promise<void>;
    revert(cb?: Callback<void>): Promise<void>;
    batch(ops: BatchDbOp[], cb?: Callback<void>): Promise<void>;
    createScratchReadStream(scratchDb?: MapScratchDb): import("./scratchReadStream").ScratchReadStream;
}
declare class WrappedSecureTrie extends SecureTrie {
    static prove(trie: SecureTrie, key: Buffer | string, cb?: Callback<Buffer[] | null>): Promise<Buffer[]>;
    static verifyProof(rootHash: Buffer | string, key: Buffer | string, proofNodes: Buffer[], cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    get(key: Buffer | string, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    put(key: Buffer | string, value: Buffer | string, cb?: Callback<void>): Promise<void>;
    del(key: Buffer | string, cb?: Callback<void>): Promise<void>;
    getRaw(key: Buffer, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    putRaw(key: Buffer | string, value: Buffer, cb?: Callback<void>): Promise<void>;
    delRaw(key: Buffer, cb?: Callback<void>): Promise<void>;
    copy(): WrappedSecureTrie;
    checkRoot(root: Buffer, cb?: Callback<boolean | null>): Promise<boolean>;
    commit(cb?: Callback<void>): Promise<void>;
    revert(cb?: Callback<void>): Promise<void>;
    batch(ops: BatchDbOp[], cb?: Callback<void>): Promise<void>;
    createScratchReadStream(scratchDb?: MapScratchDb): import("./scratchReadStream").ScratchReadStream;
}
export { WrappedCheckpointTrie as CheckpointTrie };
export { WrappedSecureTrie as SecureTrie };
