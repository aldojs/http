/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.type', () => {
  it('should return type void of parameters', () => {
    const req = createRequest({
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    })

    assert.equal(req.type, 'text/html')
  })

  it('with no host present', () => {
    const req = createRequest()

    assert.equal(req.type, '')
  })
})
