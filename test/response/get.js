/* global describe, it */

'use strict'

const assert = require('assert')
const { createResponse } = require('../support')

describe('response.get(name)', () => {
  it('should return the field value', () => {
    let response = createResponse(null, {
      headers: { 'foo': 'bar' }
    })

    assert(response.get('Foo'), 'bar')
  })

  it('should return an empty string for undefined fields', () => {
    let response = createResponse()

    assert.equal(response.get('x-foo'), '')
  })
})
