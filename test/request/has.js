/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.has(header)', () => {
  it('should return a boolean', () => {
    const req = createRequest({
      headers: {
        'foo': 'foo',
        'buzz': 'buzz'
      }
    })

    assert.equal(req.has('FOO'), true)
    assert.equal(req.has('Foo'), true)
    assert.equal(req.has('bar'), false)
    assert.equal(req.has('buzz'), true)
    assert.equal(req.has('bUSY'), false)
  })
})
