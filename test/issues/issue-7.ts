
import 'mocha'
import * as assert from 'assert'
import { Response } from '../../src'
import { createResponse } from '../support'

describe('issue #7', () => {
  var response: any

  beforeEach(() => {
    response = createResponse({
      headers: { foo: 123 },
      statusMessage: 'OK',
      headersSent: true,
      statusCode: 200
    })
  })

  it('should not add or update a header', () => {
    response.set('bar', 456)
    response.set('foo', 'baz')

    assert.deepEqual(response.headers, { foo: 123 })
  })

  it('should not remove an existing header', () => {
    response.remove('foo')

    assert.deepEqual(response.headers, { foo: 123 })
  })

  it('should not update status code', () => {
    response.status = 400

    assert.equal(response.status, 200)
    assert.equal(response.message, 'OK')
  })
})
