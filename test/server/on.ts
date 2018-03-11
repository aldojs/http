
import 'mocha'
import * as http from 'http'
import * as sinon from 'sinon'
import * as assert from 'assert'
import { Server } from '../../src'

const NOOP = () => {}

describe('server.on(event, listener)', () => {
  var stub
  var server

  beforeEach(() => {
    stub = _createHttpServerStub()
    server = new Server(stub)
  })

  it('should register the listener', () => {
    server.on('foo', NOOP)

    assert(stub.on.calledOnceWith('foo', NOOP))
  })

  it('should wrap `request` listeners', () => {
    var wrapStub = sinon.stub(server, '_wrap')
    var wrapper = () => {}

    wrapStub.withArgs(NOOP).returns(wrapper)

    server.on('request', NOOP)

    assert(stub.on.calledOnceWith('request', wrapper))
  })

  it('should not wrap other event listeners', () => {
    var wrapStub = sinon.stub(server, '_wrap')
    var wrapper = () => {}

    wrapStub.withArgs(NOOP).returns(wrapper)

    server.on('foo', NOOP)

    assert(stub.on.calledOnceWith('foo', NOOP))
  })
})

function _createHttpServerStub (): sinon.SinonStub {
  return sinon.createStubInstance(http.Server)
}
