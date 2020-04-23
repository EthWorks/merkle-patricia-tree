import { MapDb } from './mapDb'
import { StreamChunk } from './model/StreamChunk'

const Writable = require('readable-stream').Writable

export class MapDbWriteStream extends Writable {
  constructor(private readonly db: MapDb) {
    super({ objectMode: true })

    const self = this

    this.on('finish', function () {
      self.emit('close')
    })
  }

  async _write({ key, value }: StreamChunk, encoding: string, callback: () => void) {
    await this.db.put(key, value)
    callback()
  }
}
