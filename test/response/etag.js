/* global describe, it */

'use strict'

const assert = require('assert')
const { createResponse } = require('../support')

describe('response.etag=', () => {
  it('should not modify an etag with quotes', () => {
    const response = createResponse()

    response.etag = '"asdf"'

    assert.equal(response.get('etag'), '"asdf"')
  })

  it('should not modify a weak etag', () => {
    const response = createResponse()

    response.etag = 'W/"asdf"'

    assert.equal(response.get('etag'), 'W/"asdf"')
  })

  it('should add quotes around an etag if necessary', () => {
    const response = createResponse()

    response.etag = 'asdf'

    assert.equal(response.get('etag'), '"asdf"')
  })
})

describe('response.etag', () => {
  it('should return etag', () => {
    const response = createResponse()

    response.etag = '"asdf"'

    assert.equal(response.etag, '"asdf"')
  })
})
