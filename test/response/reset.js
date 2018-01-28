/* global describe, it */

'use strict'

const assert = require('assert')
const { createResponse } = require('../support')

describe('response.reset()', () => {
  it('should remove all fields', () => {
    let res = { headers: { 'foo': 1, 'bar': 2 } }
    let response = createResponse(null, res)

    response.reset()

    assert.deepEqual(response.headers, {})
  })
})
