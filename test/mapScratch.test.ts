import { MapDb } from '../src/mapDb'
import { expect } from 'chai'
import { MapScratchDb } from '../src/mapScratch'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

describe('MapScratchDb', () => {
  let upstreamDb: MapDb
  let scratchDb: MapScratchDb

  const key = Buffer.from('key')
  const value = Buffer.from('value')

  beforeEach(() => {
    upstreamDb = new MapDb()
    scratchDb = new MapScratchDb(upstreamDb)
  })

  describe('get', () => {
    it('returns value from scratch DB', async () => {
      await upstreamDb.put(key, Buffer.from('other value'))
      await scratchDb.put(key, value)
      await expect(scratchDb.get(key)).to.eventually.deep.eq(value)
    })

    it('returns value from upstream DB if it is not found in scratch DB', async () => {
      await upstreamDb.put(key, value)
      await expect(scratchDb.get(key)).to.eventually.deep.eq(value)
    })
  })
})
