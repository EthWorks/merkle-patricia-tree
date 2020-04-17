"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var wrappers_1 = require("./wrappers");
var baseTrie_1 = require("./baseTrie");
exports.BaseTrie = baseTrie_1.Trie;
__export(require("./wrappers"));
exports.default = wrappers_1.CheckpointTrie;
//# sourceMappingURL=index.js.map