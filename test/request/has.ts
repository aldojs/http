
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.has(header)', () => {
  it('should return a boolean', () => {
    const request = createRequest({
      headers: {
        'foo': 'foo',
        'buzz': 'buzz'
      }
    })

    assert.equal(request.has('FOO'), true)
    assert.equal(request.has('Foo'), true)
    assert.equal(request.has('bar'), false)
    assert.equal(request.has('buzz'), true)
    assert.equal(request.has('bUSY'), false)
  })
})
