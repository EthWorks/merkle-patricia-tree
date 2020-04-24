import { MapDb } from '../src/mapDb'
import { expect } from 'chai'
import { MapScratchDb } from '../src/mapScratch'

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
      upstreamDb.put(key, Buffer.from('other value'))
      scratchDb.put(key, value)
      expect(scratchDb.get(key)).to.deep.eq(value)
    })

    it('returns value from upstream DB if it is not found in scratch DB', async () => {
      upstreamDb.put(key, value)
      expect(scratchDb.get(key)).to.deep.eq(value)
    })
  })
})
