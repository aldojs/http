
import 'mocha'
import * as assert from 'assert'
import { createRequest } from '../support'

describe('ctx.url', () => {
  it('should return the pathname', () => {
    const request = createRequest({
      url: '/login?back=/dashboard'
    })

    assert.equal(request.url, '/login')
  })
})

// describe('ctx.url=', () => {
//   it('should set the pathname', () => {
//     const request = createRequest({
//       url: '/login?back=/dashboard'
//     })

//     request.url = '/logout'
//     assert.equal(request.url, '/logout')
//     assert.equal(request.stream.url, '/logout?next=/dashboard')
//   })
// })
