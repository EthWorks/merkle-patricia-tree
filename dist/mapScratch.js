"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapDb_1 = require("./mapDb");
class MapScratchDb extends mapDb_1.MapDb {
    constructor(_upstream) {
        super();
        this._upstream = _upstream;
    }
    async get(key) {
        const scratchValue = await super.get(key);
        return scratchValue !== null && scratchValue !== void 0 ? scratchValue : (await this._upstream.get(key));
    }
    /**
     * Returns a copy of the MapScratchDb instance, with a reference
     * to the **same** underlying Map and upstream MapDb instances.
     */
    copy() {
        const scratch = new MapScratchDb(this._upstream);
        scratch._map = this._map;
        return scratch;
    }
    toMapDb() {
        return new mapDb_1.MapDb(this._map);
    }
}
exports.MapScratchDb = MapScratchDb;
//# sourceMappingURL=mapScratch.js.map