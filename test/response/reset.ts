
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.reset()', () => {
  it('should remove all fields', () => {
    let response = createResponse()

    response.set({ 'foo': 1, 'bar': 2 })

    assert.deepEqual(response.headers, { 'foo': 1, 'bar': 2 })

    response.reset()

    assert.deepEqual(response.headers, {})
  })

  describe('when an object is given', () => {
    it('should reset the headers with the new values', () => {
      let response = createResponse()

      response.set({ 'foo': 1 })

      response.reset({ 'bar': 2 })

      assert.deepEqual(response.headers, { 'bar': 2 })
    })
  })
})
