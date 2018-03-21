
import 'mocha'
import * as sinon from 'sinon'
import * as assert from 'assert'
import { Server } from '../../src'
import { createHttpServerStub, noop } from '../support'

describe('server.on(event, listener)', () => {
  var stub
  var server
  var wrapStub
  var requestWrapper = () => {}

  beforeEach(() => {
    server = new Server(stub = createHttpServerStub())
    wrapStub = sinon.stub(server, '_wrap')

    wrapStub.withArgs('request', noop).returns(requestWrapper)
    wrapStub.withArgs('checkContinue', noop).returns(requestWrapper)
    wrapStub.withArgs('checkExpectation', noop).returns(requestWrapper)
  })

  it('should register the `request` listener', () => {
    server.on('request', noop)

    assert(stub.on.calledOnceWith('request', requestWrapper))
  })

  it('should wrap `checkContinue` listeners', () => {
    server.on('checkContinue', noop)

    assert(stub.on.calledOnceWith('checkContinue', requestWrapper))
  })

  it('should wrap `checkExpectation` listeners', () => {
    server.on('checkExpectation', noop)

    assert(stub.on.calledOnceWith('checkExpectation', requestWrapper))
  })

  it('should wrap any event listeners', () => {
    var anyWrapper = () => {}

    wrapStub.withArgs('foo', noop).returns(anyWrapper)
    server.on('foo', noop)

    assert(stub.on.calledOnceWith('foo', anyWrapper))
  })
})
