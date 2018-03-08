
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.protocol', () => {
  describe('when encrypted', () => {
    it('should return "https"', () => {
      const request = createRequest({
        socket: {
          encrypted: true
        }
      })

      assert.equal(request.protocol, 'https')
    })
  })

  describe('when unencrypted', () => {
    it('should return "http"', () => {
      const request = createRequest({
        socket: {}
      })

      assert.equal(request.protocol, 'http')
    })
  })

  describe('when X-Forwarded-Proto is set', () => {
    describe('and proxy is trusted', () => {
      it('should be used', () => {
        const request = createRequest({
          socket: {},
          headers: {
            'x-forwarded-proto': 'https, http'
          }
        }, { proxy: true })

        assert.equal(request.protocol, 'https')
      })

      describe('but X-Forwarded-Proto is empty', () => {
        it('should return "http"', () => {
          const request = createRequest({
            socket: {},
            headers: {
              'x-forwarded-proto': ''
            }
          }, { proxy: true })

          assert.equal(request.protocol, 'http')
        })
      })
    })

    describe('and proxy is not trusted', () => {
      it('should not be used', () => {
        const request = createRequest({
          socket: {},
          headers: {
            'x-forwarded-proto': 'https, http'
          }
        })

        assert.equal(request.protocol, 'http')
      })
    })
  })
})
