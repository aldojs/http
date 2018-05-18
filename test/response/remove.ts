
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.remove(name)', () => {
  it('should remove a field', () => {
    let response = createResponse()

    response.set({ 'foo': 'bar' })

    response.remove('Foo') // case insensitive

    assert.equal(response.get('foo'), undefined)
  })
})
