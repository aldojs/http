
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.headers', () => {
  it('should return the response header object', () => {
    const response = createResponse()

    assert.deepEqual(response.headers, response.req.headers)
  })

  it('should set the response header object', () => {
    const response = createResponse()

    response.set('X-Custom-Header', 'Its a header')

    assert.deepEqual(response.headers, response.res.getHeaders())
    assert.equal(response.headers['X-Custom-Header'], 'Its a header')
  })
})
