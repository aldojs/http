
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('req.is(type)', () => {
  it('should ignore params', () => {
    const req = createRequest({
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'transfer-encoding': 'chunked'
      }
    })

    assert.equal(req.is('text/*'), 'text/html')
  })

  describe('when no content type is given', () => {
    it('should return false', () => {
      const req = createRequest({
        headers: {
          'transfer-encoding': 'chunked'
        }
      })

      assert.equal(req.is(), false)
      assert.equal(req.is('image/*'), false)
      assert.equal(req.is('text/*', 'image/*'), false)
    })
  })

  describe('give no types', () => {
    it('should return the mime type', () => {
      const req = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(req.is(), 'image/png')
    })
  })

  describe('given one type', () => {
    it('should return the type or false', () => {
      const req = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(req.is('png'), 'png')
      assert.equal(req.is('.png'), '.png')
      assert.equal(req.is('image/png'), 'image/png')
      assert.equal(req.is('image/*'), 'image/png')
      assert.equal(req.is('*/png'), 'image/png')

      assert.equal(req.is('jpeg'), false)
      assert.equal(req.is('.jpeg'), false)
      assert.equal(req.is('image/jpeg'), false)
      assert.equal(req.is('text/*'), false)
      assert.equal(req.is('*/jpeg'), false)
    })
  })

  describe('given multiple types', () => {
    it('should return the first match or false', () => {
      const req = createRequest({
        headers: {
          'transfer-encoding': 'chunked',
          'content-type': 'image/png'
        }
      })

      assert.equal(req.is('png'), 'png')
      assert.equal(req.is('.png'), '.png')
      assert.equal(req.is('text/*', 'image/*'), 'image/png')
      assert.equal(req.is('image/*', 'text/*'), 'image/png')
      assert.equal(req.is('image/*', 'image/png'), 'image/png')
      assert.equal(req.is('image/png', 'image/*'), 'image/png')

      assert.equal(req.is('jpeg'), false)
      assert.equal(req.is('.jpeg'), false)
      assert.equal(req.is('text/*', 'application/*'), false)
      assert.equal(req.is('text/html', 'text/plain', 'application/json; charset=utf-8'), false)
    })
  })

  describe('when Content-Type: application/x-www-form-urlencoded', () => {
    it('should match "urlencoded"', () => {
      const req = createRequest({
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'transfer-encoding': 'chunked'
        }
      })

      assert.equal(req.is('urlencoded'), 'urlencoded')
      assert.equal(req.is('json', 'urlencoded'), 'urlencoded')
      assert.equal(req.is('urlencoded', 'json'), 'urlencoded')
    })
  })
})
