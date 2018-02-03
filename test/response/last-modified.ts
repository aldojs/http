
import * as assert from 'assert'
import { createResponse } from '../support'

describe('response.lastModified', () => {
  it('should set the header as a UTCString', () => {
    const response = createResponse()
    const date = new Date()

    response.lastModified = date

    assert.equal(response.get('last-modified'), date.toUTCString())
  })

  it('should get the header as a Date', () => {
    // Note: Date() removes milliseconds, but it's practically important.
    const response = createResponse()
    const date = new Date()

    response.lastModified = date

    assert.equal((response.lastModified.getTime() / 1000), Math.floor(date.getTime() / 1000))
  })

  describe('when lastModified not set', () => {
    it('should get undefined', () => {
      const response = createResponse()

      assert.equal(response.lastModified, undefined)
    })
  })
})
