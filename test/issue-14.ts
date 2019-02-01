
import 'mocha'
import { Server } from '../src'
import * as assert from 'assert'
import { EventEmitter } from 'events'

function createServer (ee = new EventEmitter()) {
  return new Server(ee as any)
}

function noop () {
  // 
}

describe('issue #14', () => {
  it('should remove the listener', () => {
    let ee = new EventEmitter()
    let server = createServer(ee)

    server.on('foo', noop).off('foo', noop)

    assert.equal(ee.listenerCount('foo'), 0)
  })

  it('should remove the `request` listener', () => {
    let ee = new EventEmitter()
    let server = createServer(ee)

    server.on('request', noop).off('request', noop)

    assert.equal(ee.listenerCount('request'), 0)
  })
})
