
import * as assert from 'assert'
import { createResponse } from '../support'

describe('Test response body manipulation', () => {
  describe('response.body=', () => {
    it('should not override the status when is set', () => {
      let response = createResponse()

      response.status = 400
      response.body = 'hello'

      assert.equal(response.status, 400)
    })

    describe('when a Content-Type is already set', () => {
      it('should not override the type', () => {
        let response = createResponse()

        response.type = 'text'
        response.body = '<p>Hello</p>'

        assert.equal(response.type, 'text/plain')
      })

      it('should override it when the body is an object', () => {
        let response = createResponse()

        response.type = 'txt'
        response.body = { 'foo': 'bar' }

        assert.equal(response.type, 'application/json')
      })
    })

    describe('when the body is a string', () => {
      it('should default to text', () => {
        let response = createResponse()

        response.body = 'Hello world!'

        assert.equal(response.get('Content-Type'), 'text/plain; charset=utf-8')
      })

      it('should override the length', () => {
        let response = createResponse()

        response.body = 'Tobi'

        assert.equal(response.get('Content-Length'), 4)
      })
    })

    describe('when the body is html', () => {
      it('should default to html', () => {
        const response = createResponse()

        response.body = '<h1>Tobi</h1>'

        assert.equal(response.get('content-type'), 'text/html; charset=utf-8')
      })

      it('should set length', () => {
        const string = '<h1>Tobi</h1>'
        const response = createResponse()

        response.body = string

        assert.equal(response.length, Buffer.byteLength(string))
      })
    })

    describe('when the body is a buffer', () => {
      it('should default to an octet stream', () => {
        let response = createResponse()

        response.body = Buffer.from('Hello')

        assert.equal(response.get('Content-Type'), 'application/octet-stream')
      })

      it('should set length', () => {
        const response = createResponse()

        response.body = Buffer.from('Halo')

        assert.equal(response.get('Content-Length'), 4)
      })
    })

    describe('when an object is given', () => {
      it('should default to json', () => {
        let response = createResponse()

        response.body = { foo: 'bar' }

        assert.equal(response.type, 'application/json')
      })
    })
  })
})
