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
var checkpointTrie_1 = require("./checkpointTrie");
var secure_1 = require("./secure");
var ethereumjs_util_1 = require("ethereumjs-util");
function wrapEmptyPromise(promise, cb) {
    return promise.then(function () {
        cb === null || cb === void 0 ? void 0 : cb(null);
    }, function (err) {
        if (cb) {
            cb(err);
        }
        else {
            throw err;
        }
    });
}
function wrapPromise(promise, cb) {
    return promise.then(function (value) {
        cb === null || cb === void 0 ? void 0 : cb(null, value);
        return value;
    }, function (err) {
        if (cb) {
            cb(err, null);
            return undefined;
        }
        else {
            throw err;
        }
    });
}
var WrappedCheckpointTrie = /** @class */ (function (_super) {
    __extends(WrappedCheckpointTrie, _super);
    function WrappedCheckpointTrie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrappedCheckpointTrie.prove = function (trie, key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(checkpointTrie_1.CheckpointTrie.prove(trie, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.verifyProof = function (rootHash, key, proofNodes, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, checkpointTrie_1.CheckpointTrie.verifyProof(ethereumjs_util_1.toBuffer(rootHash), ethereumjs_util_1.toBuffer(key), proofNodes).then(function (value) {
                        if (value === null) {
                            cb === null || cb === void 0 ? void 0 : cb(new Error('verifyProof failed'), null);
                        }
                        else {
                            cb === null || cb === void 0 ? void 0 : cb(null, value);
                        }
                        return value;
                    }, function (err) {
                        if (cb) {
                            cb(err, null);
                            return undefined;
                        }
                        else {
                            throw err;
                        }
                    })];
            });
        });
    };
    WrappedCheckpointTrie.prototype.get = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(_super.prototype.get.call(this, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.put = function (key, value, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.put.call(this, ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.del = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.del.call(this, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.getRaw = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(this._mainDB.get(ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.putRaw = function (key, value, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(this._mainDB.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.delRaw = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(this._mainDB.del(ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.copy = function (includeCheckpoints) {
        if (includeCheckpoints === void 0) { includeCheckpoints = true; }
        var db = this._mainDB.copy();
        var trie = new WrappedCheckpointTrie(db._leveldb, this.root);
        if (includeCheckpoints && this.isCheckpoint) {
            trie._checkpoints = this._checkpoints.slice();
            trie._scratch = this._scratch.copy();
            trie.db = trie._scratch;
        }
        return trie;
    };
    WrappedCheckpointTrie.prototype.checkRoot = function (root, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(_super.prototype.checkRoot.call(this, ethereumjs_util_1.toBuffer(root)), cb).then(function (value) { return !!value; })];
            });
        });
    };
    WrappedCheckpointTrie.prototype.commit = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.commit.call(this), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.revert = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.revert.call(this), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.batch = function (ops, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.batch.call(this, ops), cb)];
            });
        });
    };
    WrappedCheckpointTrie.prototype.createScratchReadStream = function (scratchDb) {
        return _super.prototype._createScratchReadStream.call(this, scratchDb);
    };
    return WrappedCheckpointTrie;
}(checkpointTrie_1.CheckpointTrie));
exports.CheckpointTrie = WrappedCheckpointTrie;
var WrappedSecureTrie = /** @class */ (function (_super) {
    __extends(WrappedSecureTrie, _super);
    function WrappedSecureTrie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrappedSecureTrie.prove = function (trie, key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(secure_1.SecureTrie.prove(trie, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedSecureTrie.verifyProof = function (rootHash, key, proofNodes, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, secure_1.SecureTrie.verifyProof(ethereumjs_util_1.toBuffer(rootHash), ethereumjs_util_1.toBuffer(key), proofNodes).then(function (value) {
                        if (value === null) {
                            cb === null || cb === void 0 ? void 0 : cb(new Error('verifyProof failed'), null);
                        }
                        else {
                            cb === null || cb === void 0 ? void 0 : cb(null, value);
                        }
                        return value;
                    }, function (err) {
                        if (cb) {
                            cb(err, null);
                            return undefined;
                        }
                        else {
                            throw err;
                        }
                    })];
            });
        });
    };
    WrappedSecureTrie.prototype.get = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(_super.prototype.get.call(this, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.put = function (key, value, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.put.call(this, ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.del = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.del.call(this, ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.getRaw = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(this._mainDB.get(ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.putRaw = function (key, value, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(this._mainDB.put(ethereumjs_util_1.toBuffer(key), ethereumjs_util_1.toBuffer(value)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.delRaw = function (key, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(this._mainDB.del(ethereumjs_util_1.toBuffer(key)), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.copy = function () {
        var db = this._mainDB.copy();
        return new WrappedSecureTrie(db._leveldb, this.root);
    };
    WrappedSecureTrie.prototype.checkRoot = function (root, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapPromise(_super.prototype.checkRoot.call(this, ethereumjs_util_1.toBuffer(root)), cb).then(function (value) { return !!value; })];
            });
        });
    };
    WrappedSecureTrie.prototype.commit = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.commit.call(this), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.revert = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.revert.call(this), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.batch = function (ops, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wrapEmptyPromise(_super.prototype.batch.call(this, ops), cb)];
            });
        });
    };
    WrappedSecureTrie.prototype.createScratchReadStream = function (scratchDb) {
        return _super.prototype._createScratchReadStream.call(this, scratchDb);
    };
    return WrappedSecureTrie;
}(secure_1.SecureTrie));
exports.SecureTrie = WrappedSecureTrie;
//# sourceMappingURL=wrappers.js.map