
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.headers', () => {
  it('should return the request header object', () => {
    const request = createRequest()

    assert.deepEqual(request.headers, request.stream.headers)
  })

  it('should set the request header object', () => {
    const request = createRequest({
      headers: {
        'X-Custom-Headerfield': 'Its one header, with headerfields'
      }
    })

    assert.deepEqual(request.headers, request.stream.headers)
  })
})
