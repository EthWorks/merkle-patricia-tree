// https://github.com/ethereum/wiki/wiki/Benchmarks
import { keccak256 } from 'ethereumjs-util'
import { BaseTrie } from '../dist'
import { measureExecution } from './utils/measureExecution'
import { formatTime } from './utils/formatTime'

const ROUNDS = 1000
const SYMMETRIC = true
const ERA_SIZE = 1000

const trie = new BaseTrie()
let seed = Buffer.alloc(32).fill(0)

async function runBenchmark(): Promise<void> {
  for (let i = 0; i < ROUNDS; ++i) {
    seed = keccak256(seed)

    const genRoot = () => {
      if (i % ERA_SIZE === 0) {
        seed = trie.root
      }
    }

    if (SYMMETRIC) {
      await trie.put(seed, seed)
      genRoot()
    } else {
      const val = keccak256(seed)
      await trie.put(seed, val)
      genRoot()
    }
  }
}

async function run() {
  const time = await measureExecution(runBenchmark)
  console.log(
    `benchmarks/random.ts | rounds: ${ROUNDS}, ERA_SIZE: ${ERA_SIZE}, ` +
      `${SYMMETRIC ? 'sys' : 'rand'}: ${formatTime(time)}`,
  )
}

run()
