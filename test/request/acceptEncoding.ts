
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.acceptEncoding()', () => {
  describe('with no arguments', () => {
    describe('when Accept-Encoding is populated', () => {
      it('should return accepted encodings', () => {
        const request = createRequest({
          headers: {
            'accept-encoding': 'gzip, compress;q=0.2'
          }
        })

        assert.deepEqual(request.acceptEncoding(), ['gzip', 'compress', 'identity'])
        assert.equal(request.acceptEncoding('gzip', 'compress'), 'gzip')
      })
    })

    describe('when Accept-Encoding is not populated', () => {
      it('should return identity', () => {
        const request = createRequest()

        assert.deepEqual(request.acceptEncoding(), ['identity'])
        assert.equal(request.acceptEncoding('gzip', 'deflate', 'identity'), 'identity')
      })
    })
  })

  describe('with multiple arguments', () => {
    it('should return the best fit', () => {
      const request = createRequest({
        headers: {
          'accept-encoding': 'gzip, compress;q=0.2'
        }
      })

      assert.equal(request.acceptEncoding('compress', 'gzip'), 'gzip')
      assert.equal(request.acceptEncoding('gzip', 'compress'), 'gzip')
    })
  })
})
