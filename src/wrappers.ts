import { CheckpointTrie } from './checkpointTrie'
import { SecureTrie } from './secure-original'

class WrappedCheckpointTrie extends CheckpointTrie {
  async commit(cb?: (err: any) => void): Promise<void> {
    return super.commit().then(
      (value) => {
        cb?.(null)
        return value
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
}

class WrappedSecureTrie extends SecureTrie {}

export { WrappedCheckpointTrie as CheckpointTrie }
export { WrappedSecureTrie as SecureTrie }
