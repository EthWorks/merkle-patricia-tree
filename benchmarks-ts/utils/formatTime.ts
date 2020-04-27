import prettyTime = require('pretty-time')

export function formatTime(nanoseconds: bigint) {
  const seconds = nanoseconds / BigInt(Math.pow(10, 9))
  const remainingNs = nanoseconds - seconds * BigInt(Math.pow(10, 9))
  return prettyTime([Number(seconds), Number(remainingNs)], 'ms')
}
