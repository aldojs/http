
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.reset()', () => {
  it('should remove all fields', () => {
    let response = createResponse(null, {
      headers: { 'foo': 1, 'bar': 2 }
    })

    response.reset()

    assert.deepEqual(response.headers, {})
  })
})
