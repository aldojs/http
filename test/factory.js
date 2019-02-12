
const https = require('https')
const assert = require('assert')
const { noop } = require('./_support')
const { createServer, Server } = require('../lib')


describe('createServer()', () => {
  it('should be a function', () => {
    assert.equal(typeof createServer, 'function')
  })

  it ('should return an instance of `Server`', () => {
    assert(createServer() instanceof Server)
  })

  it('should set the listener', () => {
    let server = createServer(noop)

    assert.equal(server._emitter.listenerCount('request'), 1)
  })

  describe('when `tls` options are provided', () => {
    it('should create a HTTPS server', () => {
      var server = createServer({ tls: {} })

      assert(server._emitter instanceof https.Server)
    })
  })
})
