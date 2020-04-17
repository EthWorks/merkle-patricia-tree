import { CheckpointTrie } from './checkpointTrie'
import { SecureTrie } from './secure-original'

type EmptyCallback = (err: any) => void
type BufferCallback = (err: any, value: Buffer | null) => void

function wrapEmptyPromise(promise: Promise<void>, cb?: EmptyCallback): Promise<void> {
  return promise.then(
    () => {
      cb?.(null)
    },
    (err) => {
      if (cb) {
        cb(err)
      } else {
        throw err
      }
    },
  )
}

function wrapBufferPromise(
  promise: Promise<Buffer | null>,
  cb?: BufferCallback,
): Promise<Buffer | null> {
  return promise.then(
    (value) => {
      cb?.(null, value)
      return value
    },
    (err) => {
      if (cb) {
        cb(err, null)
        return undefined as any
      } else {
        throw err
      }
    },
  )
}

class WrappedCheckpointTrie extends CheckpointTrie {
  async get(key: Buffer, cb?: BufferCallback): Promise<Buffer | null> {
    return wrapBufferPromise(super.get(key), cb)
  }

  async put(key: Buffer, value: Buffer, cb?: EmptyCallback): Promise<void> {
    return wrapEmptyPromise(super.put(key, value), cb)
  }

  async commit(cb?: EmptyCallback): Promise<void> {
    return wrapEmptyPromise(super.commit(), cb)
  }

  async del(key: Buffer, cb?: EmptyCallback): Promise<void> {
    return wrapEmptyPromise(super.del(key), cb)
  }

  async getRaw(key: Buffer, cb?: BufferCallback): Promise<Buffer | null> {
    return wrapBufferPromise(this.db.get(key), cb)
  }

  copy(includeCheckpoints: boolean = true): WrappedCheckpointTrie {
    const db = this._mainDB.copy()
    const trie = new WrappedCheckpointTrie(db._leveldb, this.root)
    if (includeCheckpoints && this.isCheckpoint) {
      trie._checkpoints = this._checkpoints.slice()
      trie._scratch = this._scratch!.copy()
      trie.db = trie._scratch
    }
    return trie
  }
}

class WrappedSecureTrie extends SecureTrie {}

export { WrappedCheckpointTrie as CheckpointTrie }
export { WrappedSecureTrie as SecureTrie }
