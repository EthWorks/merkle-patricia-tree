import { BatchDbOp } from './model/BatchDbOp'

const stringify = (key: Buffer) => key.toString('binary')

export class MapDb {
  protected _map: Map<string, Buffer>

  constructor(map?: Map<string, Buffer>) {
    this._map = map ?? new Map()
  }

  get(key: Buffer): Buffer | null {
    return this._map.get(stringify(key)) ?? null
  }

  put(key: Buffer, val: Buffer): void {
    this._map.set(stringify(key), val)
  }

  del(key: Buffer): void {
    this._map.delete(stringify(key))
  }

  batch(opStack: BatchDbOp[]): void {
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
