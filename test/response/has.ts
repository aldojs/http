
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.has(header)', () => {
  it('should return a boolean', () => {
    const response = createResponse()

    response.set({
      'foo': 'foo',
      'buzz': 'buzz'
    })

    assert.equal(response.has('FOO'), true)
    assert.equal(response.has('Foo'), true)
    assert.equal(response.has('bar'), false)
    assert.equal(response.has('buzz'), true)
    assert.equal(response.has('bUSY'), false)
  })
})
