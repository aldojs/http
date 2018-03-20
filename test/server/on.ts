
import 'mocha'
import * as sinon from 'sinon'
import * as assert from 'assert'
import { Server } from '../../src'
import { createHttpServerStub, noop } from '../support'

describe('server.on(event, listener)', () => {
  var stub
  var server

  beforeEach(() => {
    stub = createHttpServerStub()
    server = new Server(stub)
  })

  it('should register the listener', () => {
    server.on('foo', noop)

    assert(stub.on.calledOnceWith('foo', noop))
  })

  it('should wrap `request` listeners', () => {
    var wrapStub = sinon.stub(server, '_wrap')
    var wrapper = function _wrapper () {}

    wrapStub.withArgs(noop).returns(wrapper)

    server.on('request', noop)

    assert(stub.on.calledOnceWith('request', wrapper))
  })

  it('should not wrap other event listeners', () => {
    var wrapStub = sinon.stub(server, '_wrap')
    var wrapper = function _wrapper () {}

    wrapStub.withArgs(noop).returns(wrapper)

    server.on('foo', noop)

    assert(stub.on.calledOnceWith('foo', noop))
  })
})
