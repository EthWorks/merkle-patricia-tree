/// <reference types="node" />
import { Trie as BaseTrie } from './baseTrie';
import { ScratchReadStream } from './scratchReadStream';
import { ScratchDB } from './scratch';
import { DB, BatchDBOp } from './db';
import { TrieNode } from './trieNode';
export declare class CheckpointTrie extends BaseTrie {
    _mainDB: DB;
    _scratch: ScratchDB | null;
    _checkpoints: Buffer[];
    constructor(...args: any);
    /**
     * Is the trie during a checkpoint phase?
     */
    get isCheckpoint(): boolean;
    /**
     * Creates a checkpoint that can later be reverted to or committed.
     * After this is called, no changes to the trie will be permanently saved
     * until `commit` is called. Calling `putRaw` overrides the checkpointing
     * mechanism and would directly write to db.
     */
    checkpoint(): void;
    /**
     * Commits a checkpoint to disk, if current checkpoint is not nested. If
     * nested, only sets the parent checkpoint as current checkpoint.
     * @method commit
     * @returns {Promise}
     * @throws If not during a checkpoint phase
     */
    commit(): Promise<void>;
    /**
     * Reverts the trie to the state it was at when `checkpoint` was first called.
     * If during a nested checkpoint, sets root to most recent checkpoint, and sets
     * parent checkpoint as current.
     */
    revert(): Promise<void>;
    /**
     * Returns a copy of the underlying trie with the interface
     * of CheckpointTrie. If during a checkpoint, the copy will
     * contain the checkpointing metadata (incl. reference to the same scratch).
     * @param {boolean} includeCheckpoints - If true and during a checkpoint, the copy will
     * contain the checkpointing metadata and will use the same scratch as underlying db.
     */
    copy(includeCheckpoints?: boolean): CheckpointTrie;
    /**
     * Enter into checkpoint mode.
     * @private
     */
    _enterCpMode(): void;
    /**
     * Exit from checkpoint mode.
     * @private
     */
    _exitCpMode(commitState: boolean): Promise<void>;
    /**
     * Returns a `ScratchReadStream` based on the state updates
     * since checkpoint.
     * @method createScratchReadStream
     * @private
     */
    _createScratchReadStream(scratchDb?: ScratchDB): ScratchReadStream;
    /**
     * Formats node to be saved by levelup.batch.
     * @method _formatNode
     * @private
     * @param {TrieNode} node - the node to format
     * @param {Boolean} topLevel - if the node is at the top level
     * @param {BatchDBOp[]} opStack - the opStack to push the node's data
     * @param {Boolean} remove - whether to remove the node (only used for CheckpointTrie)
     * @returns {Buffer | (EmbeddedNode | null)[]} - the node's hash used as the key or the rawNode
     */
    _formatNode(node: TrieNode, topLevel: boolean, opStack: BatchDBOp[], remove?: boolean): Buffer | (Buffer | Buffer[] | null)[];
}
