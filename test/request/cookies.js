/* global describe, it */

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.cookies', () => {
  it('should return the request cookies object', () => {
    const req = createRequest()

    assert.deepEqual(req.cookies, {})
  })

  it('should set the request cookies object', () => {
    const req = createRequest({
      headers: {
        'cookie': 'a=b; foo=bar'
      }
    })

    assert.deepEqual(req.cookies, { a: 'b', foo: 'bar' })
  })
})
