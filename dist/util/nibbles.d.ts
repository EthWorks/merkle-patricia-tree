/// <reference types="node" />
/**
 * Converts a buffer to a nibble array.
 * @method bufferToNibbles
 * @param {Buffer} key
 * @private
 */
export declare function bufferToNibbles(key: Buffer): number[];
/**
 * Converts a nibble array into a buffer.
 * @method nibblesToBuffer
 * @param {Array} Nibble array
 * @private
 */
export declare function nibblesToBuffer(arr: number[]): Buffer;
/**
 * Returns the number of in order matching nibbles of two give nibble arrays.
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 * @private
 */
export declare function matchingNibbleLength(nib1: number[], nib2: number[]): number;
/**
 * Compare two nibble array keys.
 * @param {Array} keyA
 * @param {Array} keyB
 */
export declare function doKeysMatch(keyA: number[], keyB: number[]): boolean;
