
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('req.ips', () => {
  describe('when X-Forwarded-For is present', () => {
    describe('and proxy is not trusted', () => {
      it('should be ignored', () => {
        const request = createRequest({
          headers: {
            'x-forwarded-for': '127.0.0.1,127.0.0.2'
          }
        })

        assert.deepEqual(request.ips, [])
      })
    })

    describe('and proxy is trusted', () => {
      it('should be used', () => {
        const request = createRequest({
          headers: {
            'x-forwarded-for': '127.0.0.1,127.0.0.2'
          }
        }, { proxy: true })

        assert.deepEqual(request.ips, ['127.0.0.1', '127.0.0.2'])
      })
    })
  })
})
