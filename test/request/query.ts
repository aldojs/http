
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.query', () => {
  describe('when missing', () => {
    it('should return an empty object', () => {
      const request = createRequest({ url: '/' })

      assert.deepEqual(request.query, {})
    })

    it('should return the same object each time it\'s accessed', () => {
      const request = createRequest({ url: '/' })

      request.query.a = '2'

      assert.equal(request.query.a, '2')
    })
  })

  it('should return a parsed query-string', () => {
    const request = createRequest({ url: '/?page=2' })

    assert.equal(request.query.page, '2')
  })
})
