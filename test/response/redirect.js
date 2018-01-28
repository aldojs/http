/* global describe, it */

'use strict'

let assert = require('assert')
let { createResponse } = require('../support')

describe('Test response redirection', () => {
  describe('response.redirect(url)', () => {
    it('should redirect to the given url', () => {
      let url = 'http://example.com'
      let resp = createResponse()

      resp.redirect(url)

      assert.equal(resp.status, 302) // default status
      assert.equal(resp.type, 'text/html')
      assert.equal(resp.get('Location'), url)
      assert.equal(resp.body, `Redirecting to <a href="${url}">${url}</a>.`)
    })
  })

  describe('when status is 301', () => {
    it('should not override the status code', () => {
      const url = 'http://example.com'
      const resp = createResponse()

      resp.status = 301
      resp.redirect(url)

      assert.equal(resp.status, 301)
    })
  })

  describe('when status is 304', () => {
    it('should override the status code', () => {
      const url = 'http://example.com'
      const resp = createResponse()

      resp.status = 304
      resp.redirect(url)

      assert.equal(resp.status, 302)
    })
  })
})
