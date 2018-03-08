
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.status=', () => {
  it('should set the code', () => {
    let response = createResponse()

    response.status = 500

    assert.equal(response.stream.statusCode, 500)
  })

  it('should set the status message', () => {
    let response = createResponse()

    response.status = 200

    assert.equal(response.stream.statusMessage, 'OK')
  })

  describe('when empty responses code', () => {
    it('should clear the response body', () => {
      let response = createResponse()

      response.body = 'cleared'
      response.status = 204

      assert(!response.body)
    })
  })

  describe('when an non numeric status code is given', () => {
    it('throws', () => {
      let response = createResponse()

      assert.throws(() => {
        response.status = null
      })
    })
  })
})
