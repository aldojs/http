
import 'mocha'
import * as assert from 'assert'
import { createServer } from '../src'

describe('issue #14', () => {
  it('should remove the listener', () => {
    let called = false
    let server = createServer()
    let fn = () => {
      assert.ok(! called)

      called = true
    }

    server.on('foo', fn)

    server.emit('foo', 'bar')

    server.off('foo', fn)

    server.emit('foo', 'buzz')
  })
})
