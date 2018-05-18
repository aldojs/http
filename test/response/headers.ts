
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.headers', () => {
  it('should return the response header object', () => {
    let response = createResponse()

    assert.deepEqual(response.headers, {})
  })
})
