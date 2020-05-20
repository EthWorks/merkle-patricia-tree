"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = (key) => key.toString('binary');
class MapDb {
    constructor(map) {
        this._map = map !== null && map !== void 0 ? map : new Map();
    }
    async get(key) {
        var _a;
        return (_a = this._map.get(stringify(key))) !== null && _a !== void 0 ? _a : null;
    }
    async put(key, val) {
        this._map.set(stringify(key), val);
    }
    async del(key) {
        this._map.delete(stringify(key));
    }
    async batch(opStack) {
        for (const op of opStack) {
            if (op.type === 'put') {
                this._map.set(stringify(op.key), op.value);
            }
            else if (op.type === 'del') {
                this._map.delete(stringify(op.key));
            }
        }
    }
    /**
     * Returns a copy of the MapDb instance, with a reference
     * to the **same** underlying Map instance.
     */
    copy() {
        return new MapDb(this._map);
    }
}
exports.MapDb = MapDb;
//# sourceMappingURL=mapDb.js.map