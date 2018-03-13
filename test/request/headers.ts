
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request headers manipulation', () => {
  describe('request.headers', () => {
    it('should return the request header object', () => {
      const request = createRequest()

      assert.deepEqual(request.headers, request.stream.headers)
    })

    it('should set the request header object', () => {
      const request = createRequest({
        headers: {
          'X-Custom-Headerfield': 'Its one header, with headerfields'
        }
      })

      assert.deepEqual(request.headers, request.stream.headers)
    })
  })

  describe('request.get(header)', () => {
    it('should return the header value', () => {
      const request = createRequest({
        headers: {
          'host': 'http://example.com',
          'referer': 'http://example.com'
        }
      })

      assert.equal(request.get('HOST'), 'http://example.com')
      assert.equal(request.get('Host'), 'http://example.com')
      assert.equal(request.get('host'), 'http://example.com')
      assert.equal(request.get('referer'), 'http://example.com')
      assert.equal(request.get('Referrer'), 'http://example.com')
    })
  })

  describe('request.has(header)', () => {
    it('should return a boolean', () => {
      const request = createRequest({
        headers: {
          'foo': 'foo',
          'buzz': 'buzz'
        }
      })

      assert.equal(request.has('FOO'), true)
      assert.equal(request.has('Foo'), true)
      assert.equal(request.has('bar'), false)
      assert.equal(request.has('buzz'), true)
      assert.equal(request.has('bUSY'), false)
    })
  })
})
