"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a buffer to a nibble array.
 * @method bufferToNibbles
 * @param {Buffer} key
 * @private
 */
function bufferToNibbles(key) {
    const bkey = Buffer.from(key);
    let nibbles = [];
    for (let i = 0; i < bkey.length; i++) {
        let q = i * 2;
        nibbles[q] = bkey[i] >> 4;
        ++q;
        nibbles[q] = bkey[i] % 16;
    }
    return nibbles;
}
exports.bufferToNibbles = bufferToNibbles;
/**
 * Converts a nibble array into a buffer.
 * @method nibblesToBuffer
 * @param {Array} Nibble array
 * @private
 */
function nibblesToBuffer(arr) {
    let buf = Buffer.alloc(arr.length / 2);
    for (let i = 0; i < buf.length; i++) {
        let q = i * 2;
        buf[i] = (arr[q] << 4) + arr[++q];
    }
    return buf;
}
exports.nibblesToBuffer = nibblesToBuffer;
/**
 * Returns the number of in order matching nibbles of two give nibble arrays.
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 * @private
 */
function matchingNibbleLength(nib1, nib2) {
    let i = 0;
    while (nib1[i] === nib2[i] && nib1.length > i) {
        i++;
    }
    return i;
}
exports.matchingNibbleLength = matchingNibbleLength;
/**
 * Compare two nibble array keys.
 * @param {Array} keyA
 * @param {Array} keyB
 */
function doKeysMatch(keyA, keyB) {
    const length = matchingNibbleLength(keyA, keyB);
    return length === keyA.length && length === keyB.length;
}
exports.doKeysMatch = doKeysMatch;
//# sourceMappingURL=nibbles.js.map