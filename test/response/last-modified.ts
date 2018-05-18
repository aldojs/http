
import 'mocha'
import * as assert from 'assert'
import { createResponse } from './_support'

describe('response.lastModified(value)', () => {
  it('should set the header as a UTCString', () => {
    const response = createResponse()
    const date = new Date()

    response.lastModified(date)

    assert.equal(response.get('last-modified'), date.toUTCString())
  })

  it('should get the header as a Date', () => {
    // Note: Date() removes milliseconds, but it's practically important.
    const response = createResponse()
    const date = new Date()

    response.lastModified(date)

    const date2 = new Date(response.get('Last-Modified') as string)

    assert.equal((date2.getTime() / 1000), Math.floor(date.getTime() / 1000))
  })

  describe('when lastModified not set', () => {
    it('should get undefined', () => {
      const response = createResponse()

      assert.equal(response.get('Last-Modified'), undefined)
    })
  })
})
