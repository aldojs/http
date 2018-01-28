/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.query', () => {
  describe('when missing', () => {
    it('should return an empty object', () => {
      const req = createRequest({ url: '/' })

      assert.deepEqual(req.query, {})
    })

    it('should return the same object each time it\'s accessed', () => {
      const req = createRequest({ url: '/' })

      req.query.a = '2'

      assert.equal(req.query.a, '2')
    })
  })

  it('should return a parsed query-string', () => {
    const req = createRequest({ url: '/?page=2' })

    assert.equal(req.query.page, '2')
  })
})
