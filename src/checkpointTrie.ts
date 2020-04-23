import { Trie as BaseTrie } from './baseTrie'
import { ScratchReadStream } from './scratchReadStream'
import { TrieNode } from './trieNode'
import { BatchDbOp } from './model/BatchDbOp'
import { MapDb } from './mapDb'
import { MapScratchDb } from './mapScratch'
import { MapDbWriteStream } from './mapDbWriteStream'

const WriteStream = require('level-ws')

export class CheckpointTrie extends BaseTrie {
  _mainDB: MapDb
  _scratch: MapScratchDb | null
  _checkpoints: Buffer[]

  constructor(db?: MapDb | null, root?: Buffer) {
    super(db, root)
    // Reference to main DB instance
    this._mainDB = this.db
    // DB instance used for checkpoints
    this._scratch = null
    // Roots of trie at the moment of checkpoint
    this._checkpoints = []
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  get isCheckpoint() {
    return this._checkpoints.length > 0
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, no changes to the trie will be permanently saved
   * until `commit` is called. Calling `putRaw` overrides the checkpointing
   * mechanism and would directly write to db.
   */
  checkpoint() {
    const wasCheckpoint = this.isCheckpoint
    this._checkpoints.push(this.root)

    // Entering checkpoint mode is not necessary for nested checkpoints
    if (!wasCheckpoint) {
      this._enterCpMode()
    }
  }

  /**
   * Commits a checkpoint to disk, if current checkpoint is not nested. If
   * nested, only sets the parent checkpoint as current checkpoint.
   * @method commit
   * @returns {Promise}
   * @throws If not during a checkpoint phase
   */
  async commit(): Promise<void> {
    if (!this.isCheckpoint) {
      throw new Error('trying to commit when not checkpointed')
    }

    await this.lock.wait()

    this._checkpoints.pop()
    if (!this.isCheckpoint) {
      await this._exitCpMode(true)
    }

    this.lock.signal()
  }

  /**
   * Reverts the trie to the state it was at when `checkpoint` was first called.
   * If during a nested checkpoint, sets root to most recent checkpoint, and sets
   * parent checkpoint as current.
   */
  async revert(): Promise<void> {
    await this.lock.wait()
    if (this.isCheckpoint) {
      this.root = this._checkpoints.pop()!
      if (!this.isCheckpoint) {
        await this._exitCpMode(false)
      }
    }
    this.lock.signal()
  }

  /**
   * Returns a copy of the underlying trie with the interface
   * of CheckpointTrie. If during a checkpoint, the copy will
   * contain the checkpointing metadata (incl. reference to the same scratch).
   * @param {boolean} includeCheckpoints - If true and during a checkpoint, the copy will
   * contain the checkpointing metadata and will use the same scratch as underlying db.
   */
  copy(includeCheckpoints: boolean = true): CheckpointTrie {
    const db = this._mainDB.copy()
    const trie = new CheckpointTrie(db, this.root)
    if (includeCheckpoints && this.isCheckpoint) {
      trie._checkpoints = this._checkpoints.slice()
      trie._scratch = this._scratch!.copy()
      trie.db = trie._scratch
    }
    return trie
  }

  /**
   * Enter into checkpoint mode.
   * @private
   */
  _enterCpMode() {
    this._scratch = new MapScratchDb(this._mainDB)
    this.db = this._scratch
  }

  /**
   * Exit from checkpoint mode.
   * @private
   */
  async _exitCpMode(commitState: boolean): Promise<void> {
    return new Promise(async (resolve) => {
      const scratch = this._scratch as MapScratchDb
      this._scratch = null
      this.db = this._mainDB

      if (commitState) {
        this._createScratchReadStream(scratch)
          .pipe(new MapDbWriteStream(this.db))
          .on('close', resolve)
      } else {
        process.nextTick(resolve)
      }
    })
  }

  /**
   * Returns a `ScratchReadStream` based on the state updates
   * since checkpoint.
   * @method createScratchReadStream
   * @private
   */
  _createScratchReadStream(scratchDb?: MapScratchDb) {
    const scratch = scratchDb || this._scratch
    if (!scratch) {
      throw new Error('No scratch found to use')
    }
    const trie = new BaseTrie(scratch.toMapDb(), this.root)
    trie.db = scratch
    return new ScratchReadStream(trie)
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
  _formatNode(node: TrieNode, topLevel: boolean, opStack: BatchDbOp[], remove: boolean = false) {
    const rlpNode = node.serialize()

    if (rlpNode.length >= 32 || topLevel) {
      const hashRoot = node.hash()

      if (remove && this.isCheckpoint) {
        opStack.push({
          type: 'del',
          key: hashRoot,
        })
      } else {
        opStack.push({
          type: 'put',
          key: hashRoot,
          value: rlpNode,
        })
      }

      return hashRoot
    }

    return node.raw()
  }
}
