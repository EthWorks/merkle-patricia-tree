/// <reference types="node" />
import Semaphore from 'semaphore-async-await';
import { LevelUp } from 'levelup';
import { DB, BatchDBOp } from './db';
import { TrieReadStream as ReadStream } from './readStream';
import { TrieNode, EmbeddedNode } from './trieNode';
interface Path {
    node: TrieNode | null;
    remaining: number[];
    stack: TrieNode[];
}
declare type FoundNode = (nodeRef: Buffer, node: TrieNode, key: number[], walkController: any) => void;
/**
 * Use `import { BaseTrie as Trie } from 'merkle-patricia-tree'` for the base interface.
 * In Ethereum applications stick with the Secure Trie Overlay `import { SecureTrie } from 'merkle-patricia-tree'`.
 * The API for the base and the secure interface are about the same.
 * @param {Object} [db] - A [levelup](https://github.com/Level/levelup) instance. By default creates an in-memory [memdown](https://github.com/Level/memdown) instance.
 * If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/Level/memdown)
 * @param {Buffer} [root] - A `Buffer` for the root of a previously stored trie
 * @prop {Buffer} root - The current root of the `trie`
 * @prop {Buffer} EMPTY_TRIE_ROOT - The root for an empty trie
 */
export declare class Trie {
    EMPTY_TRIE_ROOT: Buffer;
    db: DB;
    protected lock: Semaphore;
    private _root;
    constructor(db?: LevelUp | null, root?: Buffer);
    static fromProof(proofNodes: Buffer[], proofTrie?: Trie): Promise<Trie>;
    static prove(trie: Trie, key: Buffer): Promise<Buffer[]>;
    static verifyProof(rootHash: Buffer, key: Buffer, proofNodes: Buffer[]): Promise<Buffer | null>;
    set root(value: Buffer);
    get root(): Buffer;
    setRoot(value?: Buffer): void;
    /**
     * Gets a value given a `key`
     * @method get
     * @memberof Trie
     * @param {Buffer} key - the key to search for
     * @returns {Promise} - Returns a promise that resolves to `Buffer` if a value was found or `null` if no value was found.
     */
    get(key: Buffer): Promise<Buffer | null>;
    /**
     * Stores a given `value` at the given `key`
     * @method put
     * @memberof Trie
     * @param {Buffer} key
     * @param {Buffer} value
     * @returns {Promise}
     */
    put(key: Buffer, value: Buffer): Promise<void>;
    /**
     * deletes a value given a `key`
     * @method del
     * @memberof Trie
     * @param {Buffer} key
     * @returns {Promise}
     */
    del(key: Buffer): Promise<void>;
    _lookupNode(node: Buffer | Buffer[]): Promise<TrieNode | null>;
    _putNode(node: TrieNode): Promise<void>;
    /**
     * Tries to find a path to the node for the given key.
     * It returns a `stack` of nodes to the closet node.
     * @method findPath
     * @memberof Trie
     * @param {Buffer} key - the search key
     * @returns {Promise}
     */
    findPath(key: Buffer): Promise<Path>;
    _findValueNodes(onFound: FoundNode): Promise<void>;
    _findDbNodes(onFound: FoundNode): Promise<void>;
    /**
     * Updates a node
     * @method _updateNode
     * @private
     * @param {Buffer} key
     * @param {Buffer} value
     * @param {number[]} keyRemainder
     * @param {TrieNode[]} stack
     * @returns {Promise}
     */
    _updateNode(k: Buffer, value: Buffer, keyRemainder: number[], stack: TrieNode[]): Promise<void>;
    /**
     * Walks a trie until finished.
     * @method _walkTrie
     * @private
     * @param {Buffer} root
     * @param {Function} onNode - callback to call when a node is found
     * @returns {Promise} - returns when finished walking trie
     */
    _walkTrie(root: Buffer, onNode: FoundNode): Promise<void>;
    /**
     * saves a stack
     * @method _saveStack
     * @private
     * @param {Array} key - the key. Should follow the stack
     * @param {Array} stack - a stack of nodes to the value given by the key
     * @param {Array} opStack - a stack of levelup operations to commit at the end of this funciton
     * @returns {Promise}
     */
    _saveStack(key: number[], stack: TrieNode[], opStack: BatchDBOp[]): Promise<void>;
    _deleteNode(k: Buffer, stack: TrieNode[]): Promise<void>;
    _createInitialNode(key: Buffer, value: Buffer): Promise<void>;
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
    _formatNode(node: TrieNode, topLevel: boolean, opStack: BatchDBOp[], remove?: boolean): Buffer | (EmbeddedNode | null)[];
    /**
     * The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.
     * @method createReadStream
     * @memberof Trie
     * @return {stream.Readable} Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
     */
    createReadStream(): ReadStream;
    copy(): Trie;
    /**
     * The given hash of operations (key additions or deletions) are executed on the DB
     * @method batch
     * @memberof Trie
     * @example
     * const ops = [
     *    { type: 'del', key: Buffer.from('father') }
     *  , { type: 'put', key: Buffer.from('name'), value: Buffer.from('Yuri Irsenovich Kim') }
     *  , { type: 'put', key: Buffer.from('dob'), value: Buffer.from('16 February 1941') }
     *  , { type: 'put', key: Buffer.from('spouse'), value: Buffer.from('Kim Young-sook') }
     *  , { type: 'put', key: Buffer.from('occupation'), value: Buffer.from('Clown') }
     * ]
     * await trie.batch(ops)
     * @param {Array} ops
     * @returns {Promise}
     */
    batch(ops: BatchDBOp[]): Promise<void>;
    /**
     * Checks if a given root exists.
     */
    checkRoot(root: Buffer): Promise<boolean>;
}
export {};
