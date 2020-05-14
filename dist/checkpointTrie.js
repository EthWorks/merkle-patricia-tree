"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var baseTrie_1 = require("./baseTrie");
var scratchReadStream_1 = require("./scratchReadStream");
var scratch_1 = require("./scratch");
var WriteStream = require('level-ws');
var CheckpointTrie = /** @class */ (function (_super) {
    __extends(CheckpointTrie, _super);
    function CheckpointTrie() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.apply(this, args) || this;
        // Reference to main DB instance
        _this._mainDB = _this.db;
        // DB instance used for checkpoints
        _this._scratch = null;
        // Roots of trie at the moment of checkpoint
        _this._checkpoints = [];
        return _this;
    }
    Object.defineProperty(CheckpointTrie.prototype, "isCheckpoint", {
        /**
         * Is the trie during a checkpoint phase?
         */
        get: function () {
            return this._checkpoints.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a checkpoint that can later be reverted to or committed.
     * After this is called, no changes to the trie will be permanently saved
     * until `commit` is called. Calling `putRaw` overrides the checkpointing
     * mechanism and would directly write to db.
     */
    CheckpointTrie.prototype.checkpoint = function () {
        var wasCheckpoint = this.isCheckpoint;
        this._checkpoints.push(this.root);
        // Entering checkpoint mode is not necessary for nested checkpoints
        if (!wasCheckpoint && this.isCheckpoint) {
            this._enterCpMode();
        }
    };
    /**
     * Commits a checkpoint to disk, if current checkpoint is not nested. If
     * nested, only sets the parent checkpoint as current checkpoint.
     * @method commit
     * @returns {Promise}
     * @throws If not during a checkpoint phase
     */
    CheckpointTrie.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isCheckpoint) {
                            throw new Error('trying to commit when not checkpointed');
                        }
                        return [4 /*yield*/, this.lock.wait()];
                    case 1:
                        _a.sent();
                        this._checkpoints.pop();
                        if (!!this.isCheckpoint) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._exitCpMode(true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.lock.signal();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reverts the trie to the state it was at when `checkpoint` was first called.
     * If during a nested checkpoint, sets root to most recent checkpoint, and sets
     * parent checkpoint as current.
     */
    CheckpointTrie.prototype.revert = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lock.wait()];
                    case 1:
                        _a.sent();
                        if (!this.isCheckpoint) return [3 /*break*/, 3];
                        this.root = this._checkpoints.pop();
                        if (!!this.isCheckpoint) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._exitCpMode(false)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.lock.signal();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a copy of the underlying trie with the interface
     * of CheckpointTrie. If during a checkpoint, the copy will
     * contain the checkpointing metadata (incl. reference to the same scratch).
     * @param {boolean} includeCheckpoints - If true and during a checkpoint, the copy will
     * contain the checkpointing metadata and will use the same scratch as underlying db.
     */
    CheckpointTrie.prototype.copy = function (includeCheckpoints) {
        if (includeCheckpoints === void 0) { includeCheckpoints = true; }
        var db = this._mainDB.copy();
        var trie = new CheckpointTrie(db._leveldb, this.root);
        if (includeCheckpoints && this.isCheckpoint) {
            trie._checkpoints = this._checkpoints.slice();
            trie._scratch = this._scratch.copy();
            trie.db = trie._scratch;
        }
        return trie;
    };
    /**
     * Enter into checkpoint mode.
     * @private
     */
    CheckpointTrie.prototype._enterCpMode = function () {
        this._scratch = new scratch_1.ScratchDB(this._mainDB);
        this.db = this._scratch;
    };
    /**
     * Exit from checkpoint mode.
     * @private
     */
    CheckpointTrie.prototype._exitCpMode = function (commitState) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var scratch;
                        return __generator(this, function (_a) {
                            scratch = this._scratch;
                            this._scratch = null;
                            this.db = this._mainDB;
                            if (commitState) {
                                this._createScratchReadStream(scratch)
                                    .pipe(WriteStream(this.db._leveldb))
                                    .on('close', resolve);
                            }
                            else {
                                process.nextTick(resolve);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    /**
     * Returns a `ScratchReadStream` based on the state updates
     * since checkpoint.
     * @method createScratchReadStream
     * @private
     */
    CheckpointTrie.prototype._createScratchReadStream = function (scratchDb) {
        var scratch = scratchDb || this._scratch;
        if (!scratch) {
            throw new Error('No scratch found to use');
        }
        var trie = new baseTrie_1.Trie(scratch._leveldb, this.root);
        trie.db = scratch;
        return new scratchReadStream_1.ScratchReadStream(trie);
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
    CheckpointTrie.prototype._formatNode = function (node, topLevel, opStack, remove) {
        if (remove === void 0) { remove = false; }
        var rlpNode = node.serialize();
        if (rlpNode.length >= 32 || topLevel) {
            var hashRoot = node.hash();
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
    };
    return CheckpointTrie;
}(baseTrie_1.Trie));
exports.CheckpointTrie = CheckpointTrie;
//# sourceMappingURL=checkpointTrie.js.map