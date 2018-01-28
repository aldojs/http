/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.headers', () => {
  it('should return the request header object', () => {
    const req = createRequest()

    assert.deepEqual(req.headers, req.req.headers)
  })

  it('should set the request header object', () => {
    const req = createRequest({
      headers: {
        'X-Custom-Headerfield': 'Its one header, with headerfields'
      }
    })

    assert.deepEqual(req.headers, req.req.headers)
  })
})
