/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.length', () => {
  it('should return length in content-length', () => {
    const req = createRequest({
      headers: {
        'content-length': '10'
      }
    })

    assert.equal(req.length, 10)
  })

  it('with no content-length present', () => {
    const req = createRequest()

    assert.equal(req.length, undefined)
  })
})
