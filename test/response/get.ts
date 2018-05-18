
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.get(name)', () => {
  it('should return the field value', () => {
    let response = createResponse()

    response.set('X-Foo', 'bar')

    assert(response.get('X-Foo'), 'bar')
  })

  describe('when the header is not present', () => {
    it('should return `undefined`', () => {
      let response = createResponse()

      assert.equal(response.get('x-foo'), undefined)
    })
  })
})
