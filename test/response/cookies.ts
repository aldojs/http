
// set the same cookie multiple times

import * as assert from 'assert'
import { createResponse } from '../support'

describe('response cookies manipulation', () => {
  describe('response.setCookie(name, string)', () => {
    it('should set a cookie', () => {
      var response = createResponse()

      response.setCookie('foo', 'bar')

      assert.equal(response.get('Set-Cookie'), 'foo=bar')
    })

    it('should allow multiple calls', () => {
      var response = createResponse()
      var cookies = ['age=1', 'name=foo', 'gender=bar']

      response.setCookie('age', '1')
      response.setCookie('name', 'foo')
      response.setCookie('gender', 'bar')
      
      assert.deepEqual(response.get('Set-Cookie'), cookies)
    })
  })

  describe('response.setCookie(name, string, options)', () => {
    it('should set a cookie with options', () => {
      var response = createResponse()

      response.setCookie('foo', 'bar', { httpOnly: true, secure: true })

      assert.equal(response.get('Set-Cookie'), 'foo=bar; HttpOnly; Secure')
    })

    it('should allow multiple cookies with options', () => {
      var cookies = [
        'age=1; Path=/',
        'name=foo; Secure',
        'gender=bar; HttpOnly'
      ]
      var response = createResponse()

      response.setCookie('age', '1', { path: '/' })
      response.setCookie('name', 'foo', { secure: true })
      response.setCookie('gender', 'bar', { httpOnly: true })

      assert.deepEqual(response.get('Set-Cookie'), cookies)
    })
  })

  describe('response.clearCookie(name)', () => {
    it('should set a cookie passed expiry', () => {
      var response = createResponse()
      var cookie = 'sid=; Expires=Thu, 01 Jan 1970 00:00:00 GMT'

      response.clearCookie('sid')

      assert.equal(response.get('Set-Cookie'), cookie)
    })
  })

  describe('response.clearCookie(name, options)', () => {
    it('should set the given params', () => {
      var response = createResponse()
      var cookie = 'sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT'

      response.clearCookie('sid', { path: '/admin' })

      assert.equal(response.get('Set-Cookie'), cookie)
    })
  })
})
