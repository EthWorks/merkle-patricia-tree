import { expect } from 'chai'
import { MapDb } from '../src/mapDb'

describe('MapDb', () => {
  let mapDb: MapDb

  beforeEach(() => {
    mapDb = new MapDb()
  })

  describe('get', () => {
    it('returns null for deleted key', () => {
      mapDb.put(Buffer.from('key'), Buffer.from('value'))
      mapDb.del(Buffer.from('key'))

      expect(mapDb.get(Buffer.from('key'))).to.be.null
    })
  })

  describe('put', () => {
    it('different buffer objects holding the same value are treated as identical keys', () => {
      mapDb.put(Buffer.from('key'), Buffer.from('value'))
      mapDb.put(Buffer.from('key'), Buffer.from('value2'))

      expect(mapDb.get(Buffer.from('key'))).to.deep.eq(Buffer.from('value2'))
    })
  })

  describe('batch', () => {
    it('applies operations in the order of appearance', () => {
      mapDb.batch([
        {
          type: 'put',
          key: Buffer.from('key'),
          value: Buffer.from('value'),
        },
        {
          type: 'del',
          key: Buffer.from('key'),
        },
        {
          type: 'put',
          key: Buffer.from('key2'),
          value: Buffer.from('value2'),
        },
      ])

      expect(mapDb.get(Buffer.from('key'))).to.be.null
      expect(mapDb.get(Buffer.from('key2'))).to.deep.eq(Buffer.from('value2'))
    })
  })

  describe('copy', () => {
    it('creates a new MapDb instance with a reference to the same underlying map object', () => {
      mapDb.put(Buffer.from('key'), Buffer.from('value'))
      const mapDbCopy = mapDb.copy()
      mapDbCopy.del(Buffer.from('key'))

      expect(mapDb.get(Buffer.from('key'))).to.be.null
    })
  })
})
