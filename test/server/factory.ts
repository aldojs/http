
import 'mocha'
import * as http from 'http'
import * as https from 'https'
import * as assert from 'assert'
import { createServer, Server } from '../../src'

const noop = function () {}

describe('createServer()', () => {
  it('should be a function', () => {
    assert.equal(typeof createServer, 'function')
  })

  it ('should return an instance of `Server`', () => {
    assert(createServer() instanceof Server)
  })

  describe('when only a request listener is provided', () => {
    it('should create a HTTP server', () => {
      let server = createServer(noop)

      assert(server.native instanceof http.Server)
    })

    it('should set the listener', () => {
      let server = createServer(noop)

      assert.equal(server.native.listenerCount('request'), 1)
    })
  })

  describe('when only options are provided', () => {
    it('should be passed to the server constructor', () => {
      var options = { foo: 'bar' } as any

      var server = createServer(options) as any

      // TODO use a spy function instead
      assert.deepEqual(server._options, options)
    })

    describe('when `tls` options are provided', () => {
      it('should create a HTTPS server', () => {
        var server = createServer({ tls: {} })

        assert(server.native instanceof https.Server)
      })
    })
  })

  describe('when both options and listener are provided', () => {
    it('should create a HTTP server', () => {
      let server = createServer({}, noop)

      assert(server.native instanceof http.Server)
    })

    it('should set the listener', () => {
      let server = createServer({}, noop)

      assert.equal(server.native.listenerCount('request'), 1)
    })

    it('should be passed to the server constructor', () => {
      var options = { foo: 'bar' } as any

      var server = createServer(options) as any

      // TODO use a spy function instead
      assert.deepEqual(server._options, options)
    })

    describe('when `tls` options are provided', () => {
      it('should create a HTTPS server', () => {
        var server = createServer({ tls: {} })

        assert(server.native instanceof https.Server)
      })
    })
  })
})
