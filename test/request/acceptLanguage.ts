
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.acceptLanguage(langs)', () => {
  describe('with no arguments', () => {
    describe('when Accept-Language is populated', () => {
      it('should return accepted languages', () => {
        const request = createRequest({
          headers: {
            'accept-language': 'en;q=0.8, es, pt'
          }
        })

        assert.deepEqual(request.acceptLanguage(), ['es', 'pt', 'en'])
      })
    })
  })

  describe('with multiple arguments', () => {
    describe('when Accept-Language is populated', () => {
      describe('if any languages match', () => {
        it('should return the best fit', () => {
          const request = createRequest({
            headers: {
              'accept-language': 'en;q=0.8, es, pt'
            }
          })

          assert.equal(request.acceptLanguage('es', 'en'), 'es')
        })
      })

      describe('if no languages match', () => {
        it('should return false', () => {
          const request = createRequest({
            headers: {
              'accept-language': 'en;q=0.8, es, pt'
            }
          })

          assert.equal(request.acceptLanguage('fr', 'au'), false)
        })
      })
    })

    describe('when Accept-Language is not populated', () => {
      it('should return the first language', () => {
        const request = createRequest()

        assert.equal(request.acceptLanguage('es', 'en'), 'es')
      })
    })
  })
})
