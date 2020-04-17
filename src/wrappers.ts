import { CheckpointTrie } from './checkpointTrie'
import { SecureTrie } from './secure-original'

function wrapEmptyPromise(promise: Promise<void>, cb?: (err: any) => void) {
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

class WrappedCheckpointTrie extends CheckpointTrie {
  async get(key: Buffer, cb?: (err: any, value: Buffer | null) => void): Promise<Buffer | null> {
    return super.get(key).then(
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

  async put(key: Buffer, value: Buffer, cb?: (err: any) => void): Promise<void> {
    return wrapEmptyPromise(super.put(key, value), cb)
  }

  async commit(cb?: (err: any) => void): Promise<void> {
    return wrapEmptyPromise(super.commit(), cb)
  }
}

class WrappedSecureTrie extends SecureTrie {}

export { WrappedCheckpointTrie as CheckpointTrie }
export { WrappedSecureTrie as SecureTrie }
