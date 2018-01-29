/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('request.charset', () => {
  describe('with no content-type present', () => {
    it('should return ""', () => {
      const request = createRequest()

      assert(request.charset === '')
    })
  })

  describe('with content-type present', () => {
    it('should return "" if the charset is missing', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain'
        }
      })

      assert(request.charset === '')
    })
  })

  describe('with a charset', () => {
    it('should return the charset', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain; charset=iso-8859-1'
        }
      })

      assert.equal(request.charset, 'iso-8859-1')
    })

    it('should return "" if content-type is invalid', () => {
      const request = createRequest({
        headers: {
          'content-type': 'application/json; application/text; charset=utf-8'
        }
      })

      assert.equal(request.charset, '')
    })
  })
})
