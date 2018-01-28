/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.acceptLanguage(langs)', () => {
  describe('with no arguments', () => {
    describe('when Accept-Language is populated', () => {
      it('should return accepted languages', () => {
        const req = createRequest({
          headers: {
            'accept-language': 'en;q=0.8, es, pt'
          }
        })

        assert.deepEqual(req.acceptLanguage(), ['es', 'pt', 'en'])
      })
    })
  })

  describe('with multiple arguments', () => {
    describe('when Accept-Language is populated', () => {
      describe('if any languages match', () => {
        it('should return the best fit', () => {
          const req = createRequest({
            headers: {
              'accept-language': 'en;q=0.8, es, pt'
            }
          })

          assert.equal(req.acceptLanguage('es', 'en'), 'es')
        })
      })

      describe('if no languages match', () => {
        it('should return false', () => {
          const req = createRequest({
            headers: {
              'accept-language': 'en;q=0.8, es, pt'
            }
          })

          assert.equal(req.acceptLanguage('fr', 'au'), false)
        })
      })
    })

    describe('when Accept-Language is not populated', () => {
      it('should return the first language', () => {
        const req = createRequest()

        assert.equal(req.acceptLanguage('es', 'en'), 'es')
      })
    })
  })
})
