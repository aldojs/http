
import 'mocha'
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
    it('should throw', () => {
      let response = createResponse()

      assert.throws(() => {
        response.status = null
      })
    })
  })

  describe('when an out of range status code is provided', () => {
    it('should throw', () => {
      let response = createResponse()

      assert.throws(() => {
        response.status = 1234
      })
    })
  })

  describe('when headers already sent', () => {
    it('should not update the status or the message', () => {
      let response = createResponse({
        statusMessage: 'OK',
        headersSent: true,
        statusCode: 200
      })

      response.status = 400

      assert.equal(response.status, 200)
      assert.equal(response.message, 'OK')
    })
  })
})
