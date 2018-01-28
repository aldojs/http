/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.acceptEncoding()', () => {
  describe('with no arguments', () => {
    describe('when Accept-Encoding is populated', () => {
      it('should return accepted encodings', () => {
        const req = createRequest({
          headers: {
            'accept-encoding': 'gzip, compress;q=0.2'
          }
        })

        assert.deepEqual(req.acceptEncoding(), ['gzip', 'compress', 'identity'])
        assert.equal(req.acceptEncoding('gzip', 'compress'), 'gzip')
      })
    })

    describe('when Accept-Encoding is not populated', () => {
      it('should return identity', () => {
        const req = createRequest()

        assert.deepEqual(req.acceptEncoding(), ['identity'])
        assert.equal(req.acceptEncoding('gzip', 'deflate', 'identity'), 'identity')
      })
    })
  })

  describe('with multiple arguments', () => {
    it('should return the best fit', () => {
      const req = createRequest({
        headers: {
          'accept-encoding': 'gzip, compress;q=0.2'
        }
      })

      assert.equal(req.acceptEncoding('compress', 'gzip'), 'gzip')
      assert.equal(req.acceptEncoding('gzip', 'compress'), 'gzip')
    })
  })
})
