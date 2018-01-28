/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.get(header)', () => {
  it('should return the header value', () => {
    const req = createRequest({
      headers: {
        'host': 'http://example.com',
        'referer': 'http://example.com'
      }
    })

    assert.equal(req.get('HOST'), 'http://example.com')
    assert.equal(req.get('Host'), 'http://example.com')
    assert.equal(req.get('host'), 'http://example.com')
    assert.equal(req.get('referer'), 'http://example.com')
    assert.equal(req.get('Referrer'), 'http://example.com')
  })
})
