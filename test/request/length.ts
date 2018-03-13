
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.length', () => {
  it('should return length in content-length', () => {
    const request = createRequest({
      headers: {
        'content-length': '10'
      }
    })

    assert.equal(request.length, 10)
  })

  it('with no content-length present', () => {
    const request = createRequest()

    assert(isNaN(request.length))
  })
})
