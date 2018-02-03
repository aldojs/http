
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.remove(name)', () => {
  it('should remove a field', () => {
    let response = createResponse(null, {
      headers: { 'foo': 'bar' }
    })

    response.remove('Foo') // case insensitive

    assert.equal(response.get('foo'), '')
  })
})
