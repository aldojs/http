
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.querystring', () => {
  it('should return the querystring', () => {
    const request = createRequest({
      url: '/store/shoes?page=2&color=blue'
    })

    assert.equal(request.querystring, 'page=2&color=blue')
  })

  describe('when not present', () => {
    it('should return an empty string', () => {
      const request = createRequest({
        url: '/store/shoes'
      })

      assert.equal(request.querystring, '')
    })
  })
})
