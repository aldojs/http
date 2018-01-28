/* global describe, it */

'use strict'

const assert = require('assert')
const { createRequest } = require('../support')

describe('req.secure', () => {
  it('should return true when encrypted', () => {
    const req = createRequest({
      socket: {
        encrypted: true
      }
    })

    assert.equal(req.secure, true)
  })
})
