"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var semaphore_async_await_1 = require("semaphore-async-await");
var ethereumjs_util_1 = require("ethereumjs-util");
var db_1 = require("./db");
var readStream_1 = require("./readStream");
var prioritizedTaskExecutor_1 = require("./prioritizedTaskExecutor");
var nibbles_1 = require("./util/nibbles");
var trieNode_1 = require("./trieNode");
var assert = require('assert');
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
var Trie = /** @class */ (function () {
    function Trie(db, root) {
        this.EMPTY_TRIE_ROOT = ethereumjs_util_1.KECCAK256_RLP;
        this.lock = new semaphore_async_await_1.default(1);
        this.db = db ? new db_1.DB(db) : new db_1.DB();
        this._root = this.EMPTY_TRIE_ROOT;
        if (root) {
            this.setRoot(root);
        }
    }
    Trie.fromProof = function (proofNodes, proofTrie) {
        return __awaiter(this, void 0, void 0, function () {
            var opStack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opStack = proofNodes.map(function (nodeValue) {
                            return {
                                type: 'put',
                                key: ethereumjs_util_1.keccak(nodeValue),
                                value: nodeValue,
                            };
                        });
                        if (!proofTrie) {
                            proofTrie = new Trie();
                            if (opStack[0]) {
                                proofTrie.root = opStack[0].key;
                            }
                        }
                        return [4 /*yield*/, proofTrie.db.batch(opStack)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, proofTrie];
                }
            });
        });
    };
    Trie.prove = function (trie, key) {
        return __awaiter(this, void 0, void 0, function () {
            var stack, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, trie.findPath(key)];
                    case 1:
                        stack = (_a.sent()).stack;
                        p = stack.map(function (stackElem) {
                            return stackElem.serialize();
                        });
                        return [2 /*return*/, p];
                }
            });
        });
    };
    Trie.verifyProof = function (rootHash, key, proofNodes) {
        return __awaiter(this, void 0, void 0, function () {
            var proofTrie, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proofTrie = new Trie(null, rootHash);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Trie.fromProof(proofNodes, proofTrie)];
                    case 2:
                        proofTrie = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error('Invalid proof nodes given');
                    case 4: return [2 /*return*/, proofTrie.get(key)];
                }
            });
        });
    };
    Object.defineProperty(Trie.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (value) {
            this.setRoot(value);
        },
        enumerable: true,
        configurable: true
    });
    Trie.prototype.setRoot = function (value) {
        if (!value) {
            value = this.EMPTY_TRIE_ROOT;
        }
        assert(value.length === 32, 'Invalid root length. Roots are 32 bytes');
        this._root = value;
    };
    /**
     * Gets a value given a `key`
     * @method get
     * @memberof Trie
     * @param {Buffer} key - the key to search for
     * @returns {Promise} - Returns a promise that resolves to `Buffer` if a value was found or `null` if no value was found.
     */
    Trie.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, node, remaining, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findPath(key)];
                    case 1:
                        _a = _b.sent(), node = _a.node, remaining = _a.remaining;
                        value = null;
                        if (node && remaining.length === 0) {
                            value = node.value;
                        }
                        return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Stores a given `value` at the given `key`
     * @method put
     * @memberof Trie
     * @param {Buffer} key
     * @param {Buffer} value
     * @returns {Promise}
     */
    Trie.prototype.put = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, remaining, stack;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!value || value.toString() === '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.del(key)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2: return [4 /*yield*/, this.lock.wait()];
                    case 3:
                        _b.sent();
                        if (!this.root.equals(ethereumjs_util_1.KECCAK256_RLP)) return [3 /*break*/, 5];
                        // If no root, initialize this trie
                        return [4 /*yield*/, this._createInitialNode(key, value)];
                    case 4:
                        // If no root, initialize this trie
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.findPath(key)
                        // then update
                    ];
                    case 6:
                        _a = _b.sent(), remaining = _a.remaining, stack = _a.stack;
                        // then update
                        return [4 /*yield*/, this._updateNode(key, value, remaining, stack)];
                    case 7:
                        // then update
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        this.lock.signal();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * deletes a value given a `key`
     * @method del
     * @memberof Trie
     * @param {Buffer} key
     * @returns {Promise}
     */
    Trie.prototype.del = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, node, stack;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.lock.wait()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.findPath(key)];
                    case 2:
                        _a = _b.sent(), node = _a.node, stack = _a.stack;
                        if (!node) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._deleteNode(key, stack)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        this.lock.signal();
                        return [2 /*return*/];
                }
            });
        });
    };
    // retrieves a node from dbs by hash
    Trie.prototype._lookupNode = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var value, foundNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (trieNode_1.isRawNode(node)) {
                            return [2 /*return*/, trieNode_1.decodeRawNode(node)];
                        }
                        value = null;
                        foundNode = null;
                        return [4 /*yield*/, this.db.get(node)];
                    case 1:
                        value = _a.sent();
                        if (value) {
                            foundNode = trieNode_1.decodeNode(value);
                        }
                        return [2 /*return*/, foundNode];
                }
            });
        });
    };
    // writes a single node to dbs
    Trie.prototype._putNode = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, serialized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = node.hash();
                        serialized = node.serialize();
                        return [4 /*yield*/, this.db.put(hash, serialized)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Tries to find a path to the node for the given key.
     * It returns a `stack` of nodes to the closet node.
     * @method findPath
     * @memberof Trie
     * @param {Buffer} key - the search key
     * @returns {Promise}
     */
    Trie.prototype.findPath = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var stack, targetKey;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    stack = [];
                                    targetKey = nibbles_1.bufferToNibbles(key);
                                    // walk trie and process nodes
                                    return [4 /*yield*/, this._walkTrie(this.root, function (nodeRef, node, keyProgress, walkController) { return __awaiter(_this, void 0, void 0, function () {
                                            var keyRemainder, branchIndex, branchNode, matchingLen;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        keyRemainder = targetKey.slice(nibbles_1.matchingNibbleLength(keyProgress, targetKey));
                                                        stack.push(node);
                                                        if (!(node instanceof trieNode_1.BranchNode)) return [3 /*break*/, 5];
                                                        if (!(keyRemainder.length === 0)) return [3 /*break*/, 1];
                                                        // we exhausted the key without finding a node
                                                        resolve({ node: node, remaining: [], stack: stack });
                                                        return [3 /*break*/, 4];
                                                    case 1:
                                                        branchIndex = keyRemainder[0];
                                                        branchNode = node.getBranch(branchIndex);
                                                        if (!!branchNode) return [3 /*break*/, 2];
                                                        // there are no more nodes to find and we didn't find the key
                                                        resolve({ node: null, remaining: keyRemainder, stack: stack });
                                                        return [3 /*break*/, 4];
                                                    case 2: 
                                                    // node found, continuing search
                                                    return [4 /*yield*/, walkController.only(branchIndex)];
                                                    case 3:
                                                        // node found, continuing search
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4: return [3 /*break*/, 9];
                                                    case 5:
                                                        if (!(node instanceof trieNode_1.LeafNode)) return [3 /*break*/, 6];
                                                        if (nibbles_1.doKeysMatch(keyRemainder, node.key)) {
                                                            // keys match, return node with empty key
                                                            resolve({ node: node, remaining: [], stack: stack });
                                                        }
                                                        else {
                                                            // reached leaf but keys dont match
                                                            resolve({ node: null, remaining: keyRemainder, stack: stack });
                                                        }
                                                        return [3 /*break*/, 9];
                                                    case 6:
                                                        if (!(node instanceof trieNode_1.ExtensionNode)) return [3 /*break*/, 9];
                                                        matchingLen = nibbles_1.matchingNibbleLength(keyRemainder, node.key);
                                                        if (!(matchingLen !== node.key.length)) return [3 /*break*/, 7];
                                                        // keys don't match, fail
                                                        resolve({ node: null, remaining: keyRemainder, stack: stack });
                                                        return [3 /*break*/, 9];
                                                    case 7: 
                                                    // keys match, continue search
                                                    return [4 /*yield*/, walkController.next()];
                                                    case 8:
                                                        // keys match, continue search
                                                        _a.sent();
                                                        _a.label = 9;
                                                    case 9: return [2 /*return*/];
                                                }
                                            });
                                        }); })
                                        // Resolve if _walkTrie finishes without finding any nodes
                                    ];
                                case 1:
                                    // walk trie and process nodes
                                    _a.sent();
                                    // Resolve if _walkTrie finishes without finding any nodes
                                    resolve({ node: null, remaining: [], stack: stack });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /*
     * Finds all nodes that store k,v values
     */
    Trie.prototype._findValueNodes = function (onFound) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._walkTrie(this.root, function (nodeRef, node, key, walkController) { return __awaiter(_this, void 0, void 0, function () {
                            var fullKey;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fullKey = key;
                                        if (!(node instanceof trieNode_1.LeafNode)) return [3 /*break*/, 1];
                                        fullKey = key.concat(node.key);
                                        // found leaf node!
                                        onFound(nodeRef, node, fullKey, walkController);
                                        return [3 /*break*/, 4];
                                    case 1:
                                        if (!(node instanceof trieNode_1.BranchNode && node.value)) return [3 /*break*/, 2];
                                        // found branch with value
                                        onFound(nodeRef, node, fullKey, walkController);
                                        return [3 /*break*/, 4];
                                    case 2: 
                                    // keep looking for value nodes
                                    return [4 /*yield*/, walkController.next()];
                                    case 3:
                                        // keep looking for value nodes
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Finds all nodes that are stored directly in the db
     * (some nodes are stored raw inside other nodes)
     */
    Trie.prototype._findDbNodes = function (onFound) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._walkTrie(this.root, function (nodeRef, node, key, walkController) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!trieNode_1.isRawNode(nodeRef)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, walkController.next()];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        onFound(nodeRef, node, key, walkController);
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
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
    Trie.prototype._updateNode = function (k, value, keyRemainder, stack) {
        return __awaiter(this, void 0, void 0, function () {
            var toSave, lastNode, key, matchLeaf, l, i, n, newLeaf, lastKey, matchingLength, newBranchNode, newKey, newExtNode, branchKey, formattedNode, newLeafNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toSave = [];
                        lastNode = stack.pop();
                        if (!lastNode) {
                            throw new Error('Stack underflow');
                        }
                        key = nibbles_1.bufferToNibbles(k);
                        matchLeaf = false;
                        if (lastNode instanceof trieNode_1.LeafNode) {
                            l = 0;
                            for (i = 0; i < stack.length; i++) {
                                n = stack[i];
                                if (n instanceof trieNode_1.BranchNode) {
                                    l++;
                                }
                                else {
                                    l += n.key.length;
                                }
                            }
                            if (nibbles_1.matchingNibbleLength(lastNode.key, key.slice(l)) === lastNode.key.length &&
                                keyRemainder.length === 0) {
                                matchLeaf = true;
                            }
                        }
                        if (matchLeaf) {
                            // just updating a found value
                            lastNode.value = value;
                            stack.push(lastNode);
                        }
                        else if (lastNode instanceof trieNode_1.BranchNode) {
                            stack.push(lastNode);
                            if (keyRemainder.length !== 0) {
                                // add an extension to a branch node
                                keyRemainder.shift();
                                newLeaf = new trieNode_1.LeafNode(keyRemainder, value);
                                stack.push(newLeaf);
                            }
                            else {
                                lastNode.value = value;
                            }
                        }
                        else {
                            lastKey = lastNode.key;
                            matchingLength = nibbles_1.matchingNibbleLength(lastKey, keyRemainder);
                            newBranchNode = new trieNode_1.BranchNode();
                            // create a new extension node
                            if (matchingLength !== 0) {
                                newKey = lastNode.key.slice(0, matchingLength);
                                newExtNode = new trieNode_1.ExtensionNode(newKey, value);
                                stack.push(newExtNode);
                                lastKey.splice(0, matchingLength);
                                keyRemainder.splice(0, matchingLength);
                            }
                            stack.push(newBranchNode);
                            if (lastKey.length !== 0) {
                                branchKey = lastKey.shift();
                                if (lastKey.length !== 0 || lastNode instanceof trieNode_1.LeafNode) {
                                    // shrinking extension or leaf
                                    lastNode.key = lastKey;
                                    formattedNode = this._formatNode(lastNode, false, toSave);
                                    newBranchNode.setBranch(branchKey, formattedNode);
                                }
                                else {
                                    // remove extension or attaching
                                    this._formatNode(lastNode, false, toSave, true);
                                    newBranchNode.setBranch(branchKey, lastNode.value);
                                }
                            }
                            else {
                                newBranchNode.value = lastNode.value;
                            }
                            if (keyRemainder.length !== 0) {
                                keyRemainder.shift();
                                newLeafNode = new trieNode_1.LeafNode(keyRemainder, value);
                                stack.push(newLeafNode);
                            }
                            else {
                                newBranchNode.value = value;
                            }
                        }
                        return [4 /*yield*/, this._saveStack(key, stack, toSave)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Walks a trie until finished.
     * @method _walkTrie
     * @private
     * @param {Buffer} root
     * @param {Function} onNode - callback to call when a node is found
     * @returns {Promise} - returns when finished walking trie
     */
    Trie.prototype._walkTrie = function (root, onNode) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var self, maxPoolSize, taskExecutor, processNode, node;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    self = this;
                                    root = root || this.root;
                                    if (root.equals(ethereumjs_util_1.KECCAK256_RLP)) {
                                        return [2 /*return*/, resolve()];
                                    }
                                    maxPoolSize = 500;
                                    taskExecutor = new prioritizedTaskExecutor_1.PrioritizedTaskExecutor(maxPoolSize);
                                    processNode = function (nodeRef, node, key) {
                                        if (key === void 0) { key = []; }
                                        return __awaiter(_this, void 0, void 0, function () {
                                            var walkController;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                walkController = {
                                                    next: function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var children, _loop_1, _i, children_1, child;
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            if (node instanceof trieNode_1.LeafNode) {
                                                                if (taskExecutor.finished()) {
                                                                    resolve();
                                                                }
                                                                return [2 /*return*/];
                                                            }
                                                            if (node instanceof trieNode_1.ExtensionNode) {
                                                                children = [[node.key, node.value]];
                                                            }
                                                            else if (node instanceof trieNode_1.BranchNode) {
                                                                children = node.getChildren().map(function (b) { return [[b[0]], b[1]]; });
                                                            }
                                                            if (!children) {
                                                                // Node has no children
                                                                return [2 /*return*/, resolve()];
                                                            }
                                                            _loop_1 = function (child) {
                                                                var keyExtension = child[0];
                                                                var childRef = child[1];
                                                                var childKey = key.concat(keyExtension);
                                                                var priority = childKey.length;
                                                                taskExecutor.execute(priority, function (taskCallback) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var childNode;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0: return [4 /*yield*/, self._lookupNode(childRef)];
                                                                            case 1:
                                                                                childNode = _a.sent();
                                                                                taskCallback();
                                                                                if (childNode) {
                                                                                    processNode(childRef, childNode, childKey);
                                                                                }
                                                                                return [2 /*return*/];
                                                                        }
                                                                    });
                                                                }); });
                                                            };
                                                            for (_i = 0, children_1 = children; _i < children_1.length; _i++) {
                                                                child = children_1[_i];
                                                                _loop_1(child);
                                                            }
                                                            return [2 /*return*/];
                                                        });
                                                    }); },
                                                    only: function (childIndex) { return __awaiter(_this, void 0, void 0, function () {
                                                        var childRef, childKey, priority;
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            if (!(node instanceof trieNode_1.BranchNode)) {
                                                                throw new Error('Expected branch node');
                                                            }
                                                            childRef = node.getBranch(childIndex);
                                                            if (!childRef) {
                                                                throw new Error('Could not get branch of childIndex');
                                                            }
                                                            childKey = key.slice();
                                                            childKey.push(childIndex);
                                                            priority = childKey.length;
                                                            taskExecutor.execute(priority, function (taskCallback) { return __awaiter(_this, void 0, void 0, function () {
                                                                var childNode;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, self._lookupNode(childRef)];
                                                                        case 1:
                                                                            childNode = _a.sent();
                                                                            taskCallback();
                                                                            if (!childNode) return [3 /*break*/, 3];
                                                                            return [4 /*yield*/, processNode(childRef, childNode, childKey)];
                                                                        case 2:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 4];
                                                                        case 3:
                                                                            // could not find child node
                                                                            resolve();
                                                                            _a.label = 4;
                                                                        case 4: return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); });
                                                            return [2 /*return*/];
                                                        });
                                                    }); },
                                                };
                                                if (node) {
                                                    onNode(nodeRef, node, key, walkController);
                                                }
                                                else {
                                                    resolve();
                                                }
                                                return [2 /*return*/];
                                            });
                                        });
                                    };
                                    return [4 /*yield*/, this._lookupNode(root)];
                                case 1:
                                    node = _a.sent();
                                    if (!node) return [3 /*break*/, 3];
                                    return [4 /*yield*/, processNode(root, node, [])];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    resolve();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * saves a stack
     * @method _saveStack
     * @private
     * @param {Array} key - the key. Should follow the stack
     * @param {Array} stack - a stack of nodes to the value given by the key
     * @param {Array} opStack - a stack of levelup operations to commit at the end of this funciton
     * @returns {Promise}
     */
    Trie.prototype._saveStack = function (key, stack, opStack) {
        return __awaiter(this, void 0, void 0, function () {
            var lastRoot, node, branchKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // update nodes
                        while (stack.length) {
                            node = stack.pop();
                            if (node instanceof trieNode_1.LeafNode) {
                                key.splice(key.length - node.key.length);
                            }
                            else if (node instanceof trieNode_1.ExtensionNode) {
                                key.splice(key.length - node.key.length);
                                if (lastRoot) {
                                    node.value = lastRoot;
                                }
                            }
                            else if (node instanceof trieNode_1.BranchNode) {
                                if (lastRoot) {
                                    branchKey = key.pop();
                                    node.setBranch(branchKey, lastRoot);
                                }
                            }
                            lastRoot = this._formatNode(node, stack.length === 0, opStack);
                        }
                        if (lastRoot) {
                            this.root = lastRoot;
                        }
                        return [4 /*yield*/, this.db.batch(opStack)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Trie.prototype._deleteNode = function (k, stack) {
        return __awaiter(this, void 0, void 0, function () {
            var processBranchNode, lastNode, parentNode, opStack, key, lastNodeKey, branchNodes, branchNode, branchNodeKey, foundNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processBranchNode = function (key, branchKey, branchNode, parentNode, stack) {
                            // branchNode is the node ON the branch node not THE branch node
                            if (!parentNode || parentNode instanceof trieNode_1.BranchNode) {
                                // branch->?
                                if (parentNode) {
                                    stack.push(parentNode);
                                }
                                if (branchNode instanceof trieNode_1.BranchNode) {
                                    // create an extension node
                                    // branch->extension->branch
                                    // @ts-ignore
                                    var extensionNode = new trieNode_1.ExtensionNode([branchKey], null);
                                    stack.push(extensionNode);
                                    key.push(branchKey);
                                }
                                else {
                                    var branchNodeKey = branchNode.key;
                                    // branch key is an extension or a leaf
                                    // branch->(leaf or extension)
                                    branchNodeKey.unshift(branchKey);
                                    branchNode.key = branchNodeKey.slice(0);
                                    key = key.concat(branchNodeKey);
                                }
                                stack.push(branchNode);
                            }
                            else {
                                // parent is an extension
                                var parentKey = parentNode.key;
                                if (branchNode instanceof trieNode_1.BranchNode) {
                                    // ext->branch
                                    parentKey.push(branchKey);
                                    key.push(branchKey);
                                    parentNode.key = parentKey;
                                    stack.push(parentNode);
                                }
                                else {
                                    var branchNodeKey = branchNode.key;
                                    // branch node is an leaf or extension and parent node is an exstention
                                    // add two keys together
                                    // dont push the parent node
                                    branchNodeKey.unshift(branchKey);
                                    key = key.concat(branchNodeKey);
                                    parentKey = parentKey.concat(branchNodeKey);
                                    branchNode.key = parentKey;
                                }
                                stack.push(branchNode);
                            }
                            return key;
                        };
                        lastNode = stack.pop();
                        assert(lastNode);
                        parentNode = stack.pop();
                        opStack = [];
                        key = nibbles_1.bufferToNibbles(k);
                        if (!parentNode) {
                            // the root here has to be a leaf.
                            this.root = this.EMPTY_TRIE_ROOT;
                            return [2 /*return*/];
                        }
                        if (lastNode instanceof trieNode_1.BranchNode) {
                            lastNode.value = null;
                        }
                        else {
                            // the lastNode has to be a leaf if it's not a branch.
                            // And a leaf's parent, if it has one, must be a branch.
                            if (!(parentNode instanceof trieNode_1.BranchNode)) {
                                throw new Error('Expected branch node');
                            }
                            lastNodeKey = lastNode.key;
                            key.splice(key.length - lastNodeKey.length);
                            // delete the value
                            this._formatNode(lastNode, false, opStack, true);
                            parentNode.setBranch(key.pop(), null);
                            lastNode = parentNode;
                            parentNode = stack.pop();
                        }
                        branchNodes = lastNode.getChildren();
                        if (!(branchNodes.length === 1)) return [3 /*break*/, 4];
                        branchNode = branchNodes[0][1];
                        branchNodeKey = branchNodes[0][0];
                        return [4 /*yield*/, this._lookupNode(branchNode)];
                    case 1:
                        foundNode = _a.sent();
                        if (!foundNode) return [3 /*break*/, 3];
                        key = processBranchNode(key, branchNodeKey, foundNode, parentNode, stack);
                        return [4 /*yield*/, this._saveStack(key, stack, opStack)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        // simple removing a leaf and recaluclation the stack
                        if (parentNode) {
                            stack.push(parentNode);
                        }
                        stack.push(lastNode);
                        return [4 /*yield*/, this._saveStack(key, stack, opStack)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Creates the initial node from an empty tree
    Trie.prototype._createInitialNode = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var newNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newNode = new trieNode_1.LeafNode(nibbles_1.bufferToNibbles(key), value);
                        this.root = newNode.hash();
                        return [4 /*yield*/, this._putNode(newNode)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
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
    Trie.prototype._formatNode = function (node, topLevel, opStack, remove) {
        if (remove === void 0) { remove = false; }
        var rlpNode = node.serialize();
        if (rlpNode.length >= 32 || topLevel) {
            var hashRoot = node.hash();
            opStack.push({
                type: 'put',
                key: hashRoot,
                value: rlpNode,
            });
            return hashRoot;
        }
        return node.raw();
    };
    /**
     * The `data` event is given an `Object` that has two properties; the `key` and the `value`. Both should be Buffers.
     * @method createReadStream
     * @memberof Trie
     * @return {stream.Readable} Returns a [stream](https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_readable) of the contents of the `trie`
     */
    Trie.prototype.createReadStream = function () {
        return new readStream_1.TrieReadStream(this);
    };
    // creates a new trie backed by the same db
    // and starting at the same root
    Trie.prototype.copy = function () {
        var db = this.db.copy();
        return new Trie(db._leveldb, this.root);
    };
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
    Trie.prototype.batch = function (ops) {
        var ops_1, ops_1_1;
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var op, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, 9, 14]);
                        ops_1 = __asyncValues(ops);
                        _b.label = 1;
                    case 1: return [4 /*yield*/, ops_1.next()];
                    case 2:
                        if (!(ops_1_1 = _b.sent(), !ops_1_1.done)) return [3 /*break*/, 7];
                        op = ops_1_1.value;
                        if (!(op.type === 'put')) return [3 /*break*/, 4];
                        if (!op.value) {
                            throw new Error('Invalid batch db operation');
                        }
                        return [4 /*yield*/, this.put(op.key, op.value)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(op.type === 'del')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.del(op.key)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 1];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _b.trys.push([9, , 12, 13]);
                        if (!(ops_1_1 && !ops_1_1.done && (_a = ops_1.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _a.call(ops_1)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if a given root exists.
     */
    Trie.prototype.checkRoot = function (root) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._lookupNode(root)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, !!value];
                }
            });
        });
    };
    return Trie;
}());
exports.Trie = Trie;
//# sourceMappingURL=baseTrie.js.map