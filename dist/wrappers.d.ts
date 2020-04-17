/// <reference types="node" />
import { CheckpointTrie } from './checkpointTrie';
import { SecureTrie } from './secure-original';
declare type Callback<T> = (err: any, value: T) => void;
declare class WrappedCheckpointTrie extends CheckpointTrie {
    get(key: Buffer | string, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    put(key: Buffer | string, value: Buffer | string, cb?: Callback<void>): Promise<void>;
    del(key: Buffer | string, cb?: Callback<void>): Promise<void>;
    getRaw(key: Buffer, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    putRaw(key: Buffer | string, value: Buffer, cb?: Callback<void>): Promise<void>;
    copy(includeCheckpoints?: boolean): WrappedCheckpointTrie;
    checkRoot(root: Buffer, cb?: Callback<boolean | null>): Promise<boolean>;
    commit(cb?: Callback<void>): Promise<void>;
    revert(cb?: Callback<void>): Promise<void>;
}
declare class WrappedSecureTrie extends SecureTrie {
    get(key: Buffer | string, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    put(key: Buffer | string, value: Buffer | string, cb?: Callback<void>): Promise<void>;
    del(key: Buffer | string, cb?: Callback<void>): Promise<void>;
    getRaw(key: Buffer, cb?: Callback<Buffer | null>): Promise<Buffer | null>;
    putRaw(key: Buffer | string, value: Buffer, cb?: Callback<void>): Promise<void>;
    copy(includeCheckpoints?: boolean): WrappedSecureTrie;
    checkRoot(root: Buffer, cb?: Callback<boolean | null>): Promise<boolean>;
    commit(cb?: Callback<void>): Promise<void>;
    revert(cb?: Callback<void>): Promise<void>;
}
export { WrappedCheckpointTrie as CheckpointTrie };
export { WrappedSecureTrie as SecureTrie };
