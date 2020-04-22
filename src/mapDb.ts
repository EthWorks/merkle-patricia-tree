import { BatchDbOp } from './model/BatchDbOp'

const parse = (key: Buffer) => key.toString('binary')

export class MapDb {
  private readonly _map: Map<string, Buffer>

  constructor(map?: Map<string, Buffer>) {
    this._map = map ?? new Map()
  }

  async get(key: Buffer): Promise<Buffer | null> {
    return this._map.get(parse(key)) ?? null
  }

  async put(key: Buffer, val: Buffer): Promise<void> {
    this._map.set(parse(key), val)
  }

  async del(key: Buffer): Promise<void> {
    this._map.delete(parse(key))
  }

  async batch(opStack: BatchDbOp[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'put') {
        this._map.set(parse(op.key), op.value)
      } else if (op.type === 'del') {
        this._map.delete(parse(op.key))
      }
    }
  }

  copy(): MapDb {
    return new MapDb(this._map)
  }
}
