"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseTrie_1 = require("./baseTrie");
const scratchReadStream_1 = require("./scratchReadStream");
const mapScratch_1 = require("./mapScratch");
const mapDbWriteStream_1 = require("./mapDbWriteStream");
const WriteStream = require('level-ws');
class CheckpointTrie extends baseTrie_1.Trie {
    constructor(db, root) {
        super(db, root);
        // Reference to main DB instance
        this._mainDB = this.db;
        // DB instance used for checkpoints
        this._scratch = null;
        // Roots of trie at the moment of checkpoint
        this._checkpoints = [];
    }
    /**
     * Is the trie during a checkpoint phase?
     */
    get isCheckpoint() {
        return this._checkpoints.length > 0;
    }
    /**
     * Creates a checkpoint that can later be reverted to or committed.
     * After this is called, no changes to the trie will be permanently saved
     * until `commit` is called. Calling `putRaw` overrides the checkpointing
     * mechanism and would directly write to db.
     */
    checkpoint() {
        const wasCheckpoint = this.isCheckpoint;
        this._checkpoints.push(this.root);
        // Entering checkpoint mode is not necessary for nested checkpoints
        if (!wasCheckpoint) {
            this._enterCpMode();
        }
    }
    /**
     * Commits a checkpoint to disk, if current checkpoint is not nested. If
     * nested, only sets the parent checkpoint as current checkpoint.
     * @method commit
     * @returns {Promise}
     * @throws If not during a checkpoint phase
     */
    async commit() {
        if (!this.isCheckpoint) {
            throw new Error('trying to commit when not checkpointed');
        }
        await this.lock.wait();
        this._checkpoints.pop();
        if (!this.isCheckpoint) {
            await this._exitCpMode(true);
        }
        this.lock.signal();
    }
    /**
     * Reverts the trie to the state it was at when `checkpoint` was first called.
     * If during a nested checkpoint, sets root to most recent checkpoint, and sets
     * parent checkpoint as current.
     */
    async revert() {
        await this.lock.wait();
        if (this.isCheckpoint) {
            this.root = this._checkpoints.pop();
            if (!this.isCheckpoint) {
                await this._exitCpMode(false);
            }
        }
        this.lock.signal();
    }
    /**
     * Returns a copy of the underlying trie with the interface
     * of CheckpointTrie. If during a checkpoint, the copy will
     * contain the checkpointing metadata (incl. reference to the same scratch).
     * @param {boolean} includeCheckpoints - If true and during a checkpoint, the copy will
     * contain the checkpointing metadata and will use the same scratch as underlying db.
     */
    copy(includeCheckpoints = true) {
        const db = this._mainDB.copy();
        const trie = new CheckpointTrie(db, this.root);
        if (includeCheckpoints && this.isCheckpoint) {
            trie._checkpoints = this._checkpoints.slice();
            trie._scratch = this._scratch.copy();
            trie.db = trie._scratch;
        }
        return trie;
    }
    /**
     * Enter into checkpoint mode.
     * @private
     */
    _enterCpMode() {
        this._scratch = new mapScratch_1.MapScratchDb(this._mainDB);
        this.db = this._scratch;
    }
    /**
     * Exit from checkpoint mode.
     * @private
     */
    async _exitCpMode(commitState) {
        return new Promise(async (resolve) => {
            const scratch = this._scratch;
            this._scratch = null;
            this.db = this._mainDB;
            if (commitState) {
                this._createScratchReadStream(scratch)
                    .pipe(new mapDbWriteStream_1.MapDbWriteStream(this.db))
                    .on('close', resolve);
            }
            else {
                process.nextTick(resolve);
            }
        });
    }
    /**
     * Returns a `ScratchReadStream` based on the state updates
     * since checkpoint.
     * @method createScratchReadStream
     * @private
     */
    _createScratchReadStream(scratchDb) {
        const scratch = scratchDb || this._scratch;
        if (!scratch) {
            throw new Error('No scratch found to use');
        }
        const trie = new baseTrie_1.Trie(scratch.toMapDb(), this.root);
        trie.db = scratch;
        return new scratchReadStream_1.ScratchReadStream(trie);
    }
    /**
     * Formats node to be saved by levelup.batch.
     * @method _formatNode
     * @private
     * @param {TrieNode} node - the node to format
     * @param {Boolean} topLevel - if the node is at the top level
     * @param {BatchDbOp[]} opStack - the opStack to push the node's data
     * @param {Boolean} remove - whether to remove the node (only used for CheckpointTrie)
     * @returns {Buffer | (EmbeddedNode | null)[]} - the node's hash used as the key or the rawNode
     */
    _formatNode(node, topLevel, opStack, remove = false) {
        const rlpNode = node.serialize();
        if (rlpNode.length >= 32 || topLevel) {
            const hashRoot = node.hash();
            if (remove && this.isCheckpoint) {
                opStack.push({
                    type: 'del',
                    key: hashRoot,
                });
            }
            else {
                opStack.push({
                    type: 'put',
                    key: hashRoot,
                    value: rlpNode,
                });
            }
            return hashRoot;
        }
        return node.raw();
    }
}
exports.CheckpointTrie = CheckpointTrie;
//# sourceMappingURL=checkpointTrie.js.map