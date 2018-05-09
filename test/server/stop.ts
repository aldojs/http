
import 'mocha'
import * as assert from 'assert'
import Server from '../../src/server'
import { createHttpServerStub } from './_support'

describe('server.stop()', () => {
  it('should return a promise', () => {
    var stub = createHttpServerStub()
    var server = new Server(stub)
    var result = server.stop()

    assert(result instanceof Promise)
  })

  it('should call the `close` method', () => {
    var stubServer = createHttpServerStub()
    var server = new Server(stubServer)

    server.stop()

    assert(stubServer.close.calledOnce)
  })
})
