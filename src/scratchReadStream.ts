import { Trie as BaseTrie } from './baseTrie'
import { StreamChunk } from './model/StreamChunk'
const Readable = require('readable-stream').Readable

/*
 * This is used to minimally dump the scratch into the db.
 */
export class ScratchReadStream extends Readable {
  private trie: BaseTrie
  private _started: boolean

  constructor(trie: BaseTrie) {
    super({ objectMode: true })

    this.trie = trie
    this._started = false
  }

  async _read() {
    if (this._started) {
      return
    }
    this._started = true
    await this.trie._findDbNodes(async (nodeRef, node, key, walkController) => {
      const chunk: StreamChunk = {
        key: nodeRef,
        value: node.serialize(),
      }
      this.push(chunk)
      await walkController.next()
    })
    this.push(null)
  }
}
