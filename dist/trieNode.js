"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rlp = require("rlp");
var ethereumjs_util_1 = require("ethereumjs-util");
var nibbles_1 = require("./util/nibbles");
var hex_1 = require("./util/hex");
function decodeNode(raw) {
    var des = rlp.decode(raw);
    if (!Array.isArray(des)) {
        throw new Error('Invalid node');
    }
    return decodeRawNode(des);
}
exports.decodeNode = decodeNode;
function decodeRawNode(raw) {
    if (raw.length === 17) {
        return BranchNode.fromArray(raw);
    }
    else if (raw.length === 2) {
        var nibbles = nibbles_1.bufferToNibbles(raw[0]);
        if (hex_1.isTerminator(nibbles)) {
            return new LeafNode(LeafNode.decodeKey(nibbles), raw[1]);
        }
        return new ExtensionNode(ExtensionNode.decodeKey(nibbles), raw[1]);
    }
    else {
        throw new Error('Invalid node');
    }
}
exports.decodeRawNode = decodeRawNode;
function isRawNode(n) {
    return Array.isArray(n) && !Buffer.isBuffer(n);
}
exports.isRawNode = isRawNode;
var BranchNode = /** @class */ (function () {
    function BranchNode() {
        this._branches = new Array(16).fill(null);
        this._value = null;
    }
    BranchNode.fromArray = function (arr) {
        var node = new BranchNode();
        node._branches = arr.slice(0, 16);
        node._value = arr[16];
        return node;
    };
    Object.defineProperty(BranchNode.prototype, "value", {
        get: function () {
            return this._value && this._value.length > 0 ? this._value : null;
        },
        set: function (v) {
            this._value = v;
        },
        enumerable: true,
        configurable: true
    });
    BranchNode.prototype.setBranch = function (i, v) {
        this._branches[i] = v;
    };
    BranchNode.prototype.raw = function () {
        return __spreadArrays(this._branches, [this._value]);
    };
    BranchNode.prototype.serialize = function () {
        return rlp.encode(this.raw());
    };
    BranchNode.prototype.hash = function () {
        return ethereumjs_util_1.keccak256(this.serialize());
    };
    BranchNode.prototype.getBranch = function (i) {
        var b = this._branches[i];
        if (b !== null && b.length > 0) {
            return b;
        }
        else {
            return null;
        }
    };
    BranchNode.prototype.getChildren = function () {
        var children = [];
        for (var i = 0; i < 16; i++) {
            var b = this._branches[i];
            if (b !== null && b.length > 0) {
                children.push([i, b]);
            }
        }
        return children;
    };
    return BranchNode;
}());
exports.BranchNode = BranchNode;
var ExtensionNode = /** @class */ (function () {
    function ExtensionNode(nibbles, value) {
        this._nibbles = nibbles;
        this._value = value;
    }
    ExtensionNode.encodeKey = function (key) {
        return hex_1.addHexPrefix(key, false);
    };
    ExtensionNode.decodeKey = function (key) {
        return hex_1.removeHexPrefix(key);
    };
    Object.defineProperty(ExtensionNode.prototype, "key", {
        get: function () {
            return this._nibbles.slice(0);
        },
        set: function (k) {
            this._nibbles = k;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtensionNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
        },
        enumerable: true,
        configurable: true
    });
    ExtensionNode.prototype.encodedKey = function () {
        return ExtensionNode.encodeKey(this._nibbles.slice(0));
    };
    ExtensionNode.prototype.raw = function () {
        return [nibbles_1.nibblesToBuffer(this.encodedKey()), this._value];
    };
    ExtensionNode.prototype.serialize = function () {
        return rlp.encode(this.raw());
    };
    ExtensionNode.prototype.hash = function () {
        return ethereumjs_util_1.keccak256(this.serialize());
    };
    return ExtensionNode;
}());
exports.ExtensionNode = ExtensionNode;
var LeafNode = /** @class */ (function () {
    function LeafNode(nibbles, value) {
        this._nibbles = nibbles;
        this._value = value;
    }
    LeafNode.encodeKey = function (key) {
        return hex_1.addHexPrefix(key, true);
    };
    LeafNode.decodeKey = function (encodedKey) {
        return hex_1.removeHexPrefix(encodedKey);
    };
    Object.defineProperty(LeafNode.prototype, "key", {
        get: function () {
            return this._nibbles.slice(0);
        },
        set: function (k) {
            this._nibbles = k;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LeafNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
        },
        enumerable: true,
        configurable: true
    });
    LeafNode.prototype.encodedKey = function () {
        return LeafNode.encodeKey(this._nibbles.slice(0));
    };
    LeafNode.prototype.raw = function () {
        return [nibbles_1.nibblesToBuffer(this.encodedKey()), this._value];
    };
    LeafNode.prototype.serialize = function () {
        return rlp.encode(this.raw());
    };
    LeafNode.prototype.hash = function () {
        return ethereumjs_util_1.keccak256(this.serialize());
    };
    return LeafNode;
}());
exports.LeafNode = LeafNode;
//# sourceMappingURL=trieNode.js.map