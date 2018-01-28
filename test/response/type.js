/* global describe, it */

'use strict'

let assert = require('assert')
let { createResponse } = require('../support')

describe('Test response type manipulation', () => {
  describe('response.type', () => {
    it('should return an empty string when the Content-Type is undefined', () => {
      let resp = createResponse()

      assert.equal(resp.type, '')
    })

    it('should return the Content-Type without the charset', () => {
      let resp = createResponse()

      resp.set('Content-Type', 'text/html; charset=utf-8')

      assert.equal(resp.type, 'text/html')
    })
  })

  describe('response.type=', () => {
    it('should set the Content-Type when a mime is given', () => {
      let resp = createResponse()

      resp.type = 'text/plain'

      assert.equal(resp.type, 'text/plain')
      assert.equal(resp.get('Content-Type'), 'text/plain; charset=utf-8')
    })

    it('should lookup the mime for the file an extention', () => {
      let resp = createResponse()

      resp.type = 'json'

      assert.equal(resp.type, 'application/json')
      assert.equal(resp.get('Content-Type'), 'application/json; charset=utf-8')
    })

    it('should default the charset when not given', () => {
      let resp = createResponse()

      resp.type = 'text/html'

      assert.equal(resp.type, 'text/html')
      assert.equal(resp.get('Content-Type'), 'text/html; charset=utf-8')
    })

    it('should not default the charset if it is provided', () => {
      let resp = createResponse()

      resp.type = 'text/html; charset=foo'

      assert.equal(resp.type, 'text/html')
      assert.equal(resp.get('Content-Type'), 'text/html; charset=foo')
    })

    it('should not set a Content-Type for an unknown extension', () => {
      let resp = createResponse()

      resp.type = 'asdf'

      assert(!resp.type)
      assert(!resp.get('Content-Type'))
    })
  })
})
