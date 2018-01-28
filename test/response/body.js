/* global describe, it */

'use strict'

let assert = require('assert')
let { createResponse } = require('../support')

describe('Test response body manipulation', () => {
  describe('response.body=', () => {
    it('should not override the status when is set', () => {
      let resp = createResponse()

      resp.status = 400
      resp.body = 'hello'

      assert.equal(resp.status, 400)
    })

    describe('when a Content-Type is already set', () => {
      it('should not override the type', () => {
        let resp = createResponse()

        resp.type = 'text'
        resp.body = '<p>Hello</p>'

        assert.equal(resp.type, 'text/plain')
      })

      it('should override it when the body is an object', () => {
        let resp = createResponse()

        resp.type = 'txt'
        resp.body = { 'foo': 'bar' }

        assert.equal(resp.type, 'application/json')
      })
    })

    describe('when the body is a string', () => {
      it('should default to text', () => {
        let resp = createResponse()

        resp.body = 'Hello world!'

        assert.equal(resp.get('Content-Type'), 'text/plain; charset=utf-8')
      })

      it('should override the length', () => {
        let resp = createResponse()

        resp.body = 'Tobi'

        assert.equal(resp.get('Content-Length'), 4)
      })
    })

    describe('when the body is html', () => {
      it('should default to html', () => {
        const resp = createResponse()

        resp.body = '<h1>Tobi</h1>'

        assert.equal(resp.get('content-type'), 'text/html; charset=utf-8')
      })

      it('should set length', () => {
        const string = '<h1>Tobi</h1>'
        const resp = createResponse()

        resp.body = string

        assert.equal(resp.length, Buffer.byteLength(string))
      })
    })

    describe('when the body is a buffer', () => {
      it('should default to an octet stream', () => {
        let resp = createResponse()

        resp.body = Buffer.from('Hello')

        assert.equal(resp.get('Content-Type'), 'application/octet-stream')
      })

      it('should set length', () => {
        const resp = createResponse()

        resp.body = Buffer.from('Halo')

        assert.equal(resp.get('Content-Length'), 4)
      })
    })

    describe('when an object is given', () => {
      it('should default to json', () => {
        let resp = createResponse()

        resp.body = { foo: 'bar' }

        assert.equal(resp.type, 'application/json')
      })
    })
  })
})
