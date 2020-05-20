"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rlp = require("rlp");
const ethereumjs_util_1 = require("ethereumjs-util");
const nibbles_1 = require("./util/nibbles");
const hex_1 = require("./util/hex");
function decodeNode(raw) {
    const des = rlp.decode(raw);
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
        const nibbles = nibbles_1.bufferToNibbles(raw[0]);
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
class BranchNode {
    constructor() {
        this._branches = new Array(16).fill(null);
        this._value = null;
    }
    static fromArray(arr) {
        const node = new BranchNode();
        node._branches = arr.slice(0, 16);
        node._value = arr[16];
        return node;
    }
    get value() {
        return this._value && this._value.length > 0 ? this._value : null;
    }
    set value(v) {
        this._value = v;
    }
    setBranch(i, v) {
        this._branches[i] = v;
    }
    raw() {
        return [...this._branches, this._value];
    }
    serialize() {
        return rlp.encode(this.raw());
    }
    hash() {
        return ethereumjs_util_1.keccak256(this.serialize());
    }
    getBranch(i) {
        const b = this._branches[i];
        if (b !== null && b.length > 0) {
            return b;
        }
        else {
            return null;
        }
    }
    getChildren() {
        const children = [];
        for (let i = 0; i < 16; i++) {
            let b = this._branches[i];
            if (b !== null && b.length > 0) {
                children.push([i, b]);
            }
        }
        return children;
    }
}
exports.BranchNode = BranchNode;
class ExtensionNode {
    constructor(nibbles, value) {
        this._nibbles = nibbles;
        this._value = value;
    }
    static encodeKey(key) {
        return hex_1.addHexPrefix(key, false);
    }
    static decodeKey(key) {
        return hex_1.removeHexPrefix(key);
    }
    get key() {
        return this._nibbles.slice(0);
    }
    set key(k) {
        this._nibbles = k;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    encodedKey() {
        return ExtensionNode.encodeKey(this._nibbles.slice(0));
    }
    raw() {
        return [nibbles_1.nibblesToBuffer(this.encodedKey()), this._value];
    }
    serialize() {
        return rlp.encode(this.raw());
    }
    hash() {
        return ethereumjs_util_1.keccak256(this.serialize());
    }
}
exports.ExtensionNode = ExtensionNode;
class LeafNode {
    constructor(nibbles, value) {
        this._nibbles = nibbles;
        this._value = value;
    }
    static encodeKey(key) {
        return hex_1.addHexPrefix(key, true);
    }
    static decodeKey(encodedKey) {
        return hex_1.removeHexPrefix(encodedKey);
    }
    get key() {
        return this._nibbles.slice(0);
    }
    set key(k) {
        this._nibbles = k;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    encodedKey() {
        return LeafNode.encodeKey(this._nibbles.slice(0));
    }
    raw() {
        return [nibbles_1.nibblesToBuffer(this.encodedKey()), this._value];
    }
    serialize() {
        return rlp.encode(this.raw());
    }
    hash() {
        return ethereumjs_util_1.keccak256(this.serialize());
    }
}
exports.LeafNode = LeafNode;
//# sourceMappingURL=trieNode.js.map