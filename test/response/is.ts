
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.is(type)', () => {
  it('should ignore params', () => {
    const response = createResponse()

    response.type = 'text/html; charset=utf-8'

    assert.equal(response.is('text/*'), 'text/html')
  })

  describe('when no type is set', () => {
    it('should return false', () => {
      const response = createResponse()

      assert.equal(response.is(), false)
      assert.equal(response.is('html'), false)
    })
  })

  describe('when given no types', () => {
    it('should return the type', () => {
      const response = createResponse()

      response.type = 'text/html; charset=utf-8'

      assert.equal(response.is(), 'text/html')
    })
  })

  describe('given one type', () => {
    it('should return the type or false', () => {
      const response = createResponse()

      response.type = 'image/png'

      assert.equal(response.is('png'), 'png')
      assert.equal(response.is('.png'), '.png')
      assert.equal(response.is('image/png'), 'image/png')
      assert.equal(response.is('image/*'), 'image/png')
      assert.equal(response.is('*/png'), 'image/png')

      assert.equal(response.is('jpeg'), false)
      assert.equal(response.is('.jpeg'), false)
      assert.equal(response.is('image/jpeg'), false)
      assert.equal(response.is('text/*'), false)
      assert.equal(response.is('*/jpeg'), false)
    })
  })

  describe('given multiple types', () => {
    it('should return the first match or false', () => {
      const response = createResponse()

      response.type = 'image/png'

      assert.equal(response.is('png'), 'png')
      assert.equal(response.is('.png'), '.png')
      assert.equal(response.is('text/*', 'image/*'), 'image/png')
      assert.equal(response.is('image/*', 'text/*'), 'image/png')
      assert.equal(response.is('image/*', 'image/png'), 'image/png')
      assert.equal(response.is('image/png', 'image/*'), 'image/png')

      assert.equal(response.is('text/*', 'image/*'), 'image/png')
      assert.equal(response.is('image/*', 'text/*'), 'image/png')
      assert.equal(response.is('image/*', 'image/png'), 'image/png')
      assert.equal(response.is('image/png', 'image/*'), 'image/png')

      assert.equal(response.is('jpeg'), false)
      assert.equal(response.is('.jpeg'), false)
      assert.equal(response.is('text/*', 'application/*'), false)
      assert.equal(response.is('text/html', 'text/plain', 'application/json; charset=utf-8'), false)
    })
  })

  describe('when Content-Type: application/x-www-form-urlencoded', () => {
    it('should match "urlencoded"', () => {
      const response = createResponse()

      response.type = 'application/x-www-form-urlencoded'

      assert.equal(response.is('urlencoded'), 'urlencoded')
      assert.equal(response.is('json', 'urlencoded'), 'urlencoded')
      assert.equal(response.is('urlencoded', 'json'), 'urlencoded')
    })
  })
})
