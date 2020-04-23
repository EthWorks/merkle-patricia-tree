import { MapDb } from './mapDb'

export class MapScratchDb extends MapDb {
  constructor(private readonly _upstream: MapDb) {
    super()
  }

  async get(key: Buffer): Promise<Buffer | null> {
    const scratchValue = await super.get(key)
    return scratchValue ?? (await this._upstream.get(key))
  }

  /**
   * Returns a copy of the MapScratchDb instance, with a reference
   * to the **same** underlying Map and upstream MapDb instances.
   */
  copy(): MapScratchDb {
    const scratch = new MapScratchDb(this._upstream)
    scratch._map = this._map
    return scratch
  }

  toMapDb(): MapDb {
    return new MapDb(this._map)
  }
}
