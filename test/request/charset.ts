
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.charset', () => {
  describe('with no content-type present', () => {
    it('should return ""', () => {
      const request = createRequest()

      assert(request.charset === '')
    })
  })

  describe('with content-type present', () => {
    it('should return default charset of the content type', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain'
        }
      })

      assert(request.charset === 'UTF-8')
    })
  })

  describe('with a charset', () => {
    it('should return the charset', () => {
      const request = createRequest({
        headers: {
          'content-type': 'text/plain; charset=utf-8'
        }
      })

      assert.equal(request.charset, 'UTF-8')
    })

    it('should return "" if content-type is invalid', () => {
      const request = createRequest({
        headers: {
          'content-type': 'foo/bar; charset=utf-8'
        }
      })

      assert.equal(request.charset, '')
    })
  })
})
