
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.host', () => {
  it('should return host with port', () => {
    const request = createRequest({
      headers: {
        'host': 'foo.com:3000'
      }
    })

    assert.equal(request.host, 'foo.com:3000')
  })

  describe('with no host present', () => {
    it('should return "undefined"', () => {
      const request = createRequest()

      assert.equal(request.host, undefined)
    })
  })

  describe('when X-Forwarded-Host is present', () => {
    describe('and proxy is not trusted', () => {
      it('should be ignored', () => {
        const request = createRequest({
          headers: {
            'x-forwarded-host': 'bar.com',
            'host': 'foo.com'
          }
        })

        assert.equal(request.host, 'foo.com')
      })
    })

    describe('and proxy is trusted', () => {
      it('should be used', () => {
        const request = createRequest({
          headers: {
            'x-forwarded-host': 'bar.com, baz.com',
            'host': 'foo.com'
          }
        }, { proxy: true })

        assert.equal(request.host, 'bar.com')
      })
    })
  })
})
