
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.cookies', () => {
  it('should return the request cookies object', () => {
    const request = createRequest()

    assert.deepEqual(request.cookies, {})
  })

  it('should set the request cookies object', () => {
    const request = createRequest({
      headers: {
        'cookie': 'a=b; foo=bar'
      }
    })

    assert.deepEqual(request.cookies, { a: 'b', foo: 'bar' })
  })
})
