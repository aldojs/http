
import 'mocha'
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.location', () => {
  it("should return the header's value", () => {
    var response = createResponse({
      headers: {
        'location': 'http://example.com'
      }
    })

    assert.equal(response.location, 'http://example.com')
  })
})

describe('response.location=', () => {
  it('should set the header', () => {
    var response = createResponse();

    response.location = 'http://example.com'

    assert.equal(response.get('Location'), 'http://example.com')
  })

  it('should encode the URL', () => {
    var response = createResponse();

    response.location = 'http://example.com?q=§10'

    assert.equal(response.get('Location'), 'http://example.com?q=%C2%A710')
  })
})
