
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.type(value)', () => {
  it('should set the `Content-Type` when a mime is given', () => {
    let resp = createResponse()

    resp.type('text/plain')

    assert.equal(resp.get('Content-Type'), 'text/plain; charset=utf-8')
  })

  it('should lookup the mime for the file an extention', () => {
    let resp = createResponse()

    resp.type('json')

    assert.equal(resp.get('Content-Type'), 'application/json; charset=utf-8')
  })

  it('should default the charset when not given', () => {
    let resp = createResponse()

    resp.type('text/html')

    assert.equal(resp.get('Content-Type'), 'text/html; charset=utf-8')
  })

  it('should not default the charset if it is provided', () => {
    let resp = createResponse()

    resp.type('text/html; charset=foo')

    assert.equal(resp.get('Content-Type'), 'text/html; charset=foo')
  })

  it('should not set a Content-Type for an unknown extension', () => {
    let resp = createResponse()

    resp.type('asdf')

    assert(!resp.has('Content-Type'))
  })
})
