import { expect } from 'chai'
import { MapDb } from '../src/mapDb'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

describe('MapDb', () => {
  let mapDb: MapDb

  beforeEach(() => {
    mapDb = new MapDb()
  })

  describe('get', () => {
    it('returns null for deleted key', async () => {
      await mapDb.put(Buffer.from('key'), Buffer.from('value'))
      await mapDb.del(Buffer.from('key'))

      await expect(mapDb.get(Buffer.from('key'))).to.eventually.be.null
    })
  })

  describe('put', () => {
    it('different buffer objects holding the same value are treated as identical keys', async () => {
      await mapDb.put(Buffer.from('key'), Buffer.from('value'))
      await mapDb.put(Buffer.from('key'), Buffer.from('value2'))

      await expect(mapDb.get(Buffer.from('key'))).to.eventually.deep.eq(Buffer.from('value2'))
    })
  })

  describe('batch', () => {
    it('applies operations in the order of appearance', async () => {
      await mapDb.batch([
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

      await expect(mapDb.get(Buffer.from('key'))).to.eventually.be.null
      await expect(mapDb.get(Buffer.from('key2'))).to.eventually.deep.eq(Buffer.from('value2'))
    })
  })

  describe('copy', () => {
    it('creates a new MapDb instance with a reference to the same underlying map object', async () => {
      await mapDb.put(Buffer.from('key'), Buffer.from('value'))
      const mapDbCopy = mapDb.copy()
      await mapDbCopy.del(Buffer.from('key'))

      await expect(mapDb.get(Buffer.from('key'))).to.eventually.be.null
    })
  })
})
