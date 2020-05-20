"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Writable = require('readable-stream').Writable;
class MapDbWriteStream extends Writable {
    constructor(db) {
        super({ objectMode: true });
        this.db = db;
        const self = this;
        this.on('finish', function () {
            self.emit('close');
        });
    }
    async _write({ key, value }, encoding, callback) {
        await this.db.put(key, value);
        callback();
    }
}
exports.MapDbWriteStream = MapDbWriteStream;
//# sourceMappingURL=mapDbWriteStream.js.map