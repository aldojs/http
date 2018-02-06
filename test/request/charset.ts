
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.charset', () => {
  describe('with no content-type present', () => {
    it('should return "undefined"', () => {
      const request = createRequest()

      assert.equal(request.charset, undefined)
    })
  })

  describe('with content-type present', () => {
    it('should return "undefined" of the content type', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain'
        }
      })

      assert.equal(request.charset, undefined)
    })
  })

  describe('with a charset', () => {
    it('should return the charset', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain; charset=utf-8'
        }
      })

      assert.equal(request.charset, 'utf-8')
    })

    it('should return "undefined" if content-type is invalid', () => {
      const request = createRequest({
        headers: {
          'content-type': 'foo/bar; charset=utf-8'
        }
      })

      assert.equal(request.charset, undefined)
    })
  })
})
