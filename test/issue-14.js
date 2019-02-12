
const assert = require('assert')
const { Server } = require('../src')
const { noop } = require('./_support')
const { EventEmitter } = require('events')


describe('issue #14', () => {
  it('should remove the listener', () => {
    let ee = new EventEmitter()
    let server = new Server(ee)

    server.on('foo', noop).off('foo', noop)

    assert.equal(ee.listenerCount('foo'), 0)
  })

  it('should remove the `request` listener', () => {
    let ee = new EventEmitter()
    let server = new Server(ee)

    server.on('request', noop).off('request', noop)

    assert.equal(ee.listenerCount('request'), 0)
  })
})
