
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.set(name, value)', () => {
  it('should set a field value', () => {
    let response = createResponse()

    response.set('Foo', 'bar')

    assert.equal(response.headers.foo, 'bar')
  })

  it('should set a field value of array', () => {
    let response = createResponse()

    response.set('X-Foo', ['bar', 'baz'])

    assert.deepEqual(response.headers['x-foo'], ['bar', 'baz'])
  })

  it('should set multiple fields', () => {
    let response = createResponse()

    response.set({
      'foo': 1,
      'bar': 2
    })

    assert.equal(response.headers['foo'], 1)
    assert.equal(response.headers['bar'], 2)
  })

  it('should override the value of an existing field', () => {
    let response = createResponse()

    response.set('Foo', 'bar')
    response.set('Foo', 'baz')

    assert.equal(response.headers['foo'], 'baz')
  })
})
