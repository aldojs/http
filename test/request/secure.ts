
import * as assert from 'assert'
import { createRequest } from '../support'

describe('request.secure', () => {
  it('should return true when encrypted', () => {
    const request = createRequest({
      socket: {
        encrypted: true
      }
    })

    assert.equal(request.secure, true)
  })
})
