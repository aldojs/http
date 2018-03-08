
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response status message manipulation', () => {
  describe('response.message', () => {
    it('should get the status message', () => {
      let response = createResponse({
        statusMessage: 'OK'
      })

      assert.equal(response.message, 'OK')
    })

    it('should default to status code', () => {
      let response = createResponse({
        statusCode: 200
      })

      assert.equal(response.message, 'OK')
    })
  })

  describe('response.message=', () => {
    it('should set the status message', () => {
      let response = createResponse()

      response.message = 'OK'

      assert.equal(response.stream.statusMessage, 'OK')
    })
  })
})
