/**
 * Prepends hex prefix to an array of nibbles.
 * @method addHexPrefix
 * @param {Array} Array of nibbles
 * @returns {Array} - returns buffer of encoded data
 **/
export declare function addHexPrefix(key: number[], terminator: boolean): number[];
/**
 * Removes hex prefix of an array of nibbles.
 * @method removeHexPrefix
 * @param {Array} Array of nibbles
 * @private
 */
export declare function removeHexPrefix(val: number[]): number[];
/**
 * Returns true if hexprefixed path is for a terminating (leaf) node.
 * @method isTerminator
 * @param {Array} key - an hexprefixed array of nibbles
 * @private
 */
export declare function isTerminator(key: number[]): boolean;
