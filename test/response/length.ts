
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.length', () => {
  describe('when Content-Length is defined', () => {
    it('should return a number', () => {
      const response = createResponse()

      response.set('Content-Length', '1024')

      assert.equal(response.length, 1024)
    })
  })

  describe('when Content-Length is not defined', () => {
    describe('and a .body is set', () => {
      it('should return a number', () => {
        const response = createResponse()

        response.body = 'foo'
        assert.equal(response.length, 3)

        response.body = Buffer.from('foo bar')
        assert.equal(response.length, 7)

        response.body = { hello: 'world' }
        assert.equal(response.length, 17)

        response.body = null
        assert(isNaN(response.length))
      })
    })

    describe('and .body is not set', () => {
      it('should return undefined', () => {
        const response = createResponse()

        assert(isNaN(response.length))
      })
    })
  })
})
