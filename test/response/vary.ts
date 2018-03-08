
import * as assert from 'assert'
import { createResponse } from '../support'

describe('ctx.vary(field)', () => {
  describe('when Vary is not set', () => {
    it('should set it', () => {
      const response = createResponse()

      response.vary('Accept')

      assert.equal(response.headers.vary, 'Accept')
    })
  })

  describe('when Vary is set', () => {
    it('should append', () => {
      const response = createResponse()

      response.vary('Accept')
      response.vary('Accept-Encoding')

      assert.equal(response.headers.vary, 'Accept, Accept-Encoding')
    })
  })

  describe('when Vary already contains the value', () => {
    it('should not append', () => {
      const response = createResponse()

      response.vary('Accept')
      response.vary('Accept-Encoding')
      response.vary('Accept')
      response.vary('Accept-Encoding')

      assert.equal(response.headers.vary, 'Accept, Accept-Encoding')
    })
  })

  describe('when Vary is "*"', () => {
    it('should not append', () => {
      const response = createResponse({
        headers: { vary: '*' }
      })

      response.vary('Accept')
      response.vary('Accept-Encoding')

      assert.equal(response.headers.vary, '*')
    })
  })
})
