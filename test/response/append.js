/* global describe, it */

'use strict'

const assert = require('assert')
const { createResponse } = require('../support')

describe('res.append(name, val)', () => {
  it('should append multiple headers', () => {
    const res = createResponse()

    res.append('x-foo', 'bar1')
    res.append('x-foo', 'bar2')

    assert.deepEqual(res.get('x-foo'), ['bar1', 'bar2'])
  })

  it('should accept array of values', () => {
    const res = createResponse()

    res.append('Set-Cookie', ['foo=bar', 'fizz=buzz'])
    res.append('Set-Cookie', 'hi=again')

    assert.deepEqual(res.get('set-cookie'), ['foo=bar', 'fizz=buzz', 'hi=again'])
  })

  it('should get reset by res.set(field, val)', () => {
    const res = createResponse()

    res.append('Link', '<http://localhost/>')
    res.append('Link', '<http://localhost:80/>')
    res.set('Link', '<http://127.0.0.1/>')

    assert.equal(res.get('link'), '<http://127.0.0.1/>')
  })

  it('should work with res.set(field, val) first', () => {
    const res = createResponse()

    res.set('Link', '<http://localhost/>')
    res.append('Link', '<http://localhost:80/>')

    assert.deepEqual(res.get('link'), ['<http://localhost/>', '<http://localhost:80/>'])
  })
})
