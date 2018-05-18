
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.append(name, val)', () => {
  it('should append multiple headers', () => {
    let response = createResponse()

    response.append('x-foo', 'bar1')
    response.append('x-foo', 'bar2')

    assert.deepEqual(response.get('x-foo'), ['bar1', 'bar2'])
  })

  it('should accept array of values', () => {
    let response = createResponse()

    response.append('Set-Cookie', ['foo=bar', 'fizz=buzz'])
    response.append('Set-Cookie', 'hi=again')

    assert.deepEqual(response.get('set-cookie'), ['foo=bar', 'fizz=buzz', 'hi=again'])
  })

  it('should get reset by response.set(field, val)', () => {
    let response = createResponse()

    response.append('Link', '<http://localhost:80/>')
    response.append('Link', '<http://localhost/>')
    response.set('Link', '<http://127.0.0.1/>')

    assert.equal(response.get('link'), '<http://127.0.0.1/>')
  })

  it('should work with response.set(field, val) first', () => {
    let response = createResponse()

    response.set('Link', '<http://localhost/>')
    response.append('Link', '<http://localhost:80/>')

    assert.deepEqual(response.get('link'), ['<http://localhost/>', '<http://localhost:80/>'])
  })
})
