
import 'mocha'
import * as http from 'http'
import * as sinon from 'sinon'
import * as assert from 'assert'
import { Server } from '../../src'

describe('server.start(port)', () => {
  it('should return a promise', () => {
    var stub = _createHttpServerStub()
    var server = new Server(stub)
    var result = server.start(123)

    assert(result instanceof Promise)
  })

  it('should pass options to `listen` methos', () => {
    var stub = _createHttpServerStub()
    var server = new Server(stub)

    server.start(123)

    assert(stub.listen.calledOnceWith({ port: 123 }))
  })
})

function _createHttpServerStub () {
  return sinon.createStubInstance(http.Server)
}
