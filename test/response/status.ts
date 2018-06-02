
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.status(code, message)', () => {
  describe('when a status code is given', () => {
    it('should set the code', () => {
      let response = createResponse()
  
      response.status(200, 'OK')
  
      assert.equal(response.statusCode, 200, "Status code should equal '200'")
      assert.equal(response.statusMessage, 'OK', "Status message should equal 'OK'")
    })

    describe('when an non numeric status code is given', () => {
      it('should throw', () => {
        let response = createResponse()
  
        assert.throws(() => {
          response.status(null as any)
        })
      })
    })
  
    describe('when an out of range status code is provided', () => {
      it('should throw', () => {
        let response = createResponse()
  
        assert.throws(() => {
          response.status(1234)
        })
      })
    })
  })

  describe('when a custom message is given', () => {
    it('should set the custom message', () => {
      let response = createResponse()
  
      response.status(200, 'KO')
  
      assert.equal(response.statusCode, 200, "Status code should equal '200'")
      assert.equal(response.statusMessage, 'KO', "Status message should equal 'KO'")
    })
  })
})
