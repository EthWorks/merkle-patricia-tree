import { CheckpointTrie } from './checkpointTrie'
import { SecureTrie } from './secure-original'

class WrappedCheckpointTrie extends CheckpointTrie {
  async commit(cb?: (err: any) => void): Promise<void> {
    try {
      await super.commit()
      cb?.(null)
    } catch (e) {
      if (cb) {
        cb(e)
      } else {
        throw e
      }
    }
  }
}

class WrappedSecureTrie extends SecureTrie {}

export { WrappedCheckpointTrie as CheckpointTrie }
export { WrappedSecureTrie as SecureTrie }
