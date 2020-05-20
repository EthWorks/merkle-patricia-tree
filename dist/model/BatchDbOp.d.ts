/// <reference types="node" />
export declare type BatchDbOp = PutBatch | DelBatch;
export interface PutBatch {
    type: 'put';
    key: Buffer;
    value: Buffer;
}
export interface DelBatch {
    type: 'del';
    key: Buffer;
}
