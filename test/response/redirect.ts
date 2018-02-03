
import * as assert from 'assert'
import { createResponse } from '../support'

describe('Test response redirection', () => {
  describe('response.redirect(url)', () => {
    it('should redirect to the given url', () => {
      let url = 'http://example.com'
      let response = createResponse()

      response.redirect(url)

      assert.equal(response.status, 302) // default status
      assert.equal(response.type, 'text/html')
      assert.equal(response.get('Location'), url)
      assert.equal(response.body, `Redirecting to <a href="${url}">${url}</a>.`)
    })
  })

  describe('when status is 301', () => {
    it('should not override the status code', () => {
      const url = 'http://example.com'
      const response = createResponse()

      response.status = 301
      response.redirect(url)

      assert.equal(response.status, 301)
    })
  })

  describe('when status is 304', () => {
    it('should override the status code', () => {
      const url = 'http://example.com'
      const response = createResponse()

      response.status = 304
      response.redirect(url)

      assert.equal(response.status, 302)
    })
  })
})
