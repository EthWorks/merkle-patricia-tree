"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nibbles_1 = require("./util/nibbles");
const Readable = require('readable-stream').Readable;
class TrieReadStream extends Readable {
    constructor(trie) {
        super({ objectMode: true });
        this.trie = trie;
        this._started = false;
    }
    async _read() {
        if (this._started) {
            return;
        }
        this._started = true;
        await this.trie._findValueNodes(async (nodeRef, node, key, walkController) => {
            this.push({
                key: nibbles_1.nibblesToBuffer(key),
                value: node.value,
            });
            await walkController.next();
        });
        this.push(null);
    }
}
exports.TrieReadStream = TrieReadStream;
//# sourceMappingURL=readStream.js.map