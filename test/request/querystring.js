/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.querystring', () => {
  it('should return the querystring', () => {
    const req = createRequest({
      url: '/store/shoes?page=2&color=blue'
    })

    assert.equal(req.querystring, 'page=2&color=blue')
  })

  describe('when not present', () => {
    it('should return an empty string', () => {
      const req = createRequest({
        url: '/store/shoes'
      })

      assert.equal(req.querystring, '')
    })
  })
})
