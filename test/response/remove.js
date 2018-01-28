/* global describe, it */

'use strict'

const assert = require('assert')
const { createResponse } = require('../support')

describe('response.remove(name)', () => {
  it('should remove a field', () => {
    let res = { _headers: { 'foo': 'bar' } }
    let response = createResponse(null, res)

    response.remove('Foo') // case insensitive

    assert.equal(response.get('foo'), '')
  })
})
