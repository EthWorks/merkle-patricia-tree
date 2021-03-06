import { pseudoRandomBytes } from 'crypto'
import { CheckpointTrie } from '../dist'
import { measureExecution } from './utils/measureExecution'
import { formatTime } from './utils/formatTime'
import { average, std } from './utils/metrics'

const iterations = 5000
const samples = 20
const printSampleTimes = true

async function iterTest(numOfIter: number): Promise<bigint> {
  const randomKey = pseudoRandomBytes(32)
  const vals = [...Array(numOfIter)].map(() => pseudoRandomBytes(32))
  const keys = [...Array(numOfIter)].map(() => pseudoRandomBytes(32))

  const trie = new CheckpointTrie()

  return measureExecution(async () => {
    for (let i = 0; i < numOfIter; ++i) {
      await trie.put(vals[i], keys[i])
      trie.checkpoint()
      await trie.get(randomKey)
    }
  })
}

function print(msg: string) {
  console.log(
    `benchmarks/checkpointing.ts | iterations: ${iterations}, samples: ${samples} | ${msg}`,
  )
}

async function run() {
  const sampleTimes: bigint[] = []

  for (let i = 1; i <= samples; ++i) {
    const time = await iterTest(iterations)
    sampleTimes.push(time)
    if (printSampleTimes) {
      print(`#${i} sample time: ${formatTime(time)}`)
    }
  }

  const averageTime = average(sampleTimes)
  const timesStd = std(sampleTimes)

  print(`average execution time: ${formatTime(averageTime)}, std: ${timesStd.toFixed(2)}`)
}

run()
