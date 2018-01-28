/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.host', () => {
  it('should return host with port', () => {
    const req = createRequest({
      headers: {
        'host': 'foo.com:3000'
      }
    })

    assert.equal(req.host, 'foo.com:3000')
  })

  describe('with no host present', () => {
    it('should return ""', () => {
      const req = createRequest()

      assert.equal(req.host, '')
    })
  })

  describe.skip('when X-Forwarded-Host is present', () => {
    describe('and proxy is not trusted', () => {
      it('should be ignored', () => {
        const req = createRequest({
          headers: {
            'x-forwarded-host': 'bar.com',
            'host': 'foo.com'
          }
        })

        assert.equal(req.host, 'foo.com')
      })
    })

    describe('and proxy is trusted', () => {
      it('should be used', () => {
        const req = createRequest({
          headers: {
            'x-forwarded-host': 'bar.com, baz.com',
            'host': 'foo.com'
          }
        })

        // req.proxy = true

        assert.equal(req.host, 'bar.com')
      })
    })
  })
})
