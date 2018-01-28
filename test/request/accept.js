/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('request.accept(types)', () => {
  describe('with no arguments', () => {
    describe('when Accept is populated', () => {
      it('should return all accepted types', () => {
        const req = createRequest({
          headers: {
            accept: 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
          }
        })

        assert.deepEqual(req.accept(), ['text/html', 'text/plain', 'image/jpeg', 'application/*'])
      })
    })
  })

  describe('with no valid types', () => {
    describe('when Accept is populated', () => {
      it('should return false', () => {
        const req = createRequest({
          headers: {
            accept: 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
          }
        })

        assert.equal(req.accept('image/png', 'image/tiff'), false)
      })
    })

    describe('when Accept is not populated', () => {
      it('should return the first type', () => {
        const req = createRequest()

        assert.equal(req.accept('text/html', 'text/plain', 'image/jpeg', 'application/*'), 'text/html')
      })
    })
  })

  describe('when extensions are given', () => {
    it('should convert to mime types', () => {
      const req = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(req.accept('html'), 'html')
      assert.equal(req.accept('.htm'), '.htm')
      assert.equal(req.accept('txt'), 'txt')
      assert.equal(req.accept('.txt'), '.txt')
      assert.equal(req.accept('png'), false)
    })
  })

  describe('when multiple arguments are given', () => {
    it('should return the first match', () => {
      const req = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(req.accept('png', 'html'), 'html')
      assert.equal(req.accept('png', 'text', 'html'), 'text')
    })
  })

  describe('when present in Accept as an exact match', () => {
    it('should return the type', () => {
      const req = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(req.accept('text/html'), 'text/html')
      assert.equal(req.accept('text/plain'), 'text/plain')
    })
  })

  describe('when present in Accept as a type match', () => {
    it('should return the type', () => {
      const req = createRequest({
        headers: {
          accept: 'application/json, */*;q=0.6'
        }
      })

      assert.equal(req.accept('text/html'), 'text/html')
      assert.equal(req.accept('text/plain'), 'text/plain')
      assert.equal(req.accept('image/png'), 'image/png')
    })
  })

  describe('when present in Accept as a subtype match', () => {
    it('should return the type', () => {
      const req = createRequest({
        headers: {
          accept: 'application/json, text/*'
        }
      })

      assert.equal(req.accept('text/html'), 'text/html')
      assert.equal(req.accept('text/plain'), 'text/plain')
      assert.equal(req.accept('image/png'), false)
      assert.equal(req.accept('png'), false)
    })
  })
})
