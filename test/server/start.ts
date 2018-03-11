
import 'mocha'
import * as assert from 'assert'
import { Server } from '../../src'
import { createHttpServerStub } from '../support'

describe('server.start(port)', () => {
  it('should return a promise', () => {
    var stubServer = createHttpServerStub()
    var server = new Server(stubServer)
    var result = server.start(123)

    assert(result instanceof Promise)
  })

  it('should pass options to `listen` methos', () => {
    var stubServer = createHttpServerStub()
    var server = new Server(stubServer)

    server.start(123)

    assert(stubServer.listen.calledOnceWith({ port: 123 }))
  })
})
