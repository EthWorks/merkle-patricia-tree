import { BatchDbOp } from './model/BatchDbOp'

const stringify = (key: Buffer) => key.toString('binary')

export class MapDb {
  protected _map: Map<string, Buffer>

  constructor(map?: Map<string, Buffer>) {
    this._map = map ?? new Map()
  }

  async get(key: Buffer): Promise<Buffer | null> {
    return this._map.get(stringify(key)) ?? null
  }

  async put(key: Buffer, val: Buffer): Promise<void> {
    this._map.set(stringify(key), val)
  }

  async del(key: Buffer): Promise<void> {
    this._map.delete(stringify(key))
  }

  async batch(opStack: BatchDbOp[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'put') {
        this._map.set(stringify(op.key), op.value)
      } else if (op.type === 'del') {
        this._map.delete(stringify(op.key))
      }
    }
  }

  /**
   * Returns a copy of the MapDb instance, with a reference
   * to the **same** underlying Map instance.
   */
  copy(): MapDb {
    return new MapDb(this._map)
  }
}
