const tape = require('tape')
const Trie = require('../src/index.js')

tape('SecureTrie.copy', function (it) {
  it.test('created copy includes values added after checkpoint', function (t) {
    const trie = new Trie();

    trie.put('key1', 'value1', function () {
      trie.checkpoint()
      trie.put('key2', 'value2', function () {
        const trieCopy = trie.copy();
        trieCopy.get('key2', function (err, value) {
          t.equal(value && value.toString(), 'value2')
          t.end(err)
        })
      })
    })
  })

  it.test('created copy includes values added before checkpoint', function (t) {
    const trie = new Trie();

    trie.put('key1', 'value1', function () {
      trie.checkpoint()
      trie.put('key2', 'value2', function () {
        const trieCopy = trie.copy();
        trieCopy.get('key1', function (err, value) {
          t.equal(value && value.toString(), 'value1')
          t.end(err)
        })
      })
    })
  })
})
