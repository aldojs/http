/* global describe, it */

'use strict'

let assert = require('assert')
let { createResponse } = require('../support')

describe('Test response status message manipulation', () => {
  describe('response.message', () => {
    it('should get the status message', () => {
      let response = createResponse(null, {
        statusMessage: 'OK'
      })

      assert.equal(response.message, 'OK')
    })

    it('should default to status code', () => {
      let response = createResponse(null, {
        statusCode: 200
      })

      assert.equal(response.message, 'OK')
    })
  })

  describe('response.message=', () => {
    it('should set the status message', () => {
      let response = createResponse()

      response.message = 'OK'

      assert.equal(response.res.statusMessage, 'OK')
    })
  })
})
