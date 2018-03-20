
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.accept(types)', () => {
  describe('with no arguments', () => {
    describe('when Accept is populated', () => {
      it('should return all accepted types', () => {
        const request = createRequest({
          headers: {
            accept: 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
          }
        })

        assert.deepEqual(request.accept(), ['text/html', 'text/plain', 'image/jpeg', 'application/*'])
      })
    })
  })

  describe('with no valid types', () => {
    describe('when Accept is populated', () => {
      it('should return false', () => {
        const request = createRequest({
          headers: {
            accept: 'application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain'
          }
        })

        assert.equal(request.accept('image/png', 'image/tiff'), false)
      })
    })

    describe('when Accept is not populated', () => {
      it('should return the first type', () => {
        const request = createRequest()

        assert.equal(request.accept('text/html', 'text/plain', 'image/jpeg', 'application/*'), 'text/html')
      })
    })
  })

  describe('when extensions are given', () => {
    it('should convert to mime types', () => {
      const request = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(request.accept('html'), 'html')
      assert.equal(request.accept('.htm'), '.htm')
      assert.equal(request.accept('txt'), 'txt')
      assert.equal(request.accept('.txt'), '.txt')
      assert.equal(request.accept('png'), false)
    })
  })

  describe('when multiple arguments are given', () => {
    it('should return the first match', () => {
      const request = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(request.accept('png', 'html'), 'html')
      assert.equal(request.accept('png', 'text', 'html'), 'text')
    })
  })

  describe('when present in Accept as an exact match', () => {
    it('should return the type', () => {
      const request = createRequest({
        headers: {
          accept: 'text/plain, text/html'
        }
      })

      assert.equal(request.accept('text/html'), 'text/html')
      assert.equal(request.accept('text/plain'), 'text/plain')
    })
  })

  describe('when present in Accept as a type match', () => {
    it('should return the type', () => {
      const request = createRequest({
        headers: {
          accept: 'application/json, */*;q=0.6'
        }
      })

      assert.equal(request.accept('text/html'), 'text/html')
      assert.equal(request.accept('text/plain'), 'text/plain')
      assert.equal(request.accept('image/png'), 'image/png')
    })
  })

  describe('when present in Accept as a subtype match', () => {
    it('should return the type', () => {
      const request = createRequest({
        headers: {
          accept: 'application/json, text/*'
        }
      })

      assert.equal(request.accept('text/html'), 'text/html')
      assert.equal(request.accept('text/plain'), 'text/plain')
      assert.equal(request.accept('image/png'), false)
      assert.equal(request.accept('png'), false)
    })
  })
})
