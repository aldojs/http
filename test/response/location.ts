
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.location(value)', () => {
  it('should set the header', () => {
    var response = createResponse();

    response.location('http://example.com')

    assert.equal(response.get('Location'), 'http://example.com')
  })

  it('should encode the URL', () => {
    var response = createResponse();

    response.location('http://example.com?q=§10')

    assert.equal(response.get('Location'), 'http://example.com?q=%C2%A710')
  })
})
