/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.acceptCharset()', () => {
  describe('with no arguments', () => {
    describe('when Accept-Charset is populated', () => {
      it('should return accepted charsets', () => {
        const req = createRequest({
          headers: {
            'accept-charset': 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
          }
        })

        assert.deepEqual(req.acceptCharset(), ['utf-8', 'utf-7', 'iso-8859-1'])
      })
    })
  })

  describe('with multiple arguments', () => {
    describe('when Accept-Charset is populated', () => {
      describe('if any charsets match', () => {
        it('should return the best fit', () => {
          const req = createRequest({
            headers: {
              'accept-charset': 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
            }
          })

          assert.equal(req.acceptCharset('utf-7', 'utf-8'), 'utf-8')
        })
      })

      describe('if no charsets match', () => {
        it('should return false', () => {
          const req = createRequest({
            headers: {
              'accept-charset': 'utf-8, iso-8859-1;q=0.2, utf-7;q=0.5'
            }
          })

          assert.equal(req.acceptCharset('utf-16'), false)
        })
      })
    })

    describe('when Accept-Charset is not populated', () => {
      it('should return the first charset', () => {
        const req = createRequest()

        assert.equal(req.acceptCharset('utf-7', 'utf-8'), 'utf-7')
      })
    })
  })
})
