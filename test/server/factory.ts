
import 'mocha'
import * as http from 'http'
import * as https from 'https'
import * as assert from 'assert'
import { noop } from './_support'
import { createServer, Server } from '../../src'

describe('createServer()', () => {
  it('should be a function', () => {
    assert.equal(typeof createServer, 'function')
  })

  it ('should return an instance of `Server`', () => {
    assert(createServer() instanceof Server)
  })

  it('should set the listener', () => {
    let server = createServer(noop) as any

    assert.equal(server._server.listenerCount('request'), 1)
  })

  describe('when `tls` options are provided', () => {
    it('should create a HTTPS server', () => {
      var server = createServer({ tls: {} }) as any

      assert(server._server instanceof https.Server)
    })
  })
})
