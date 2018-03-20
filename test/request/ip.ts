
import 'mocha'
import * as assert from 'assert'
const Stream = require('stream')
const Koa = require('../..')
import { createRequest } from '../support'

describe('req.ip', () => {
  describe('with req.ips present', () => {
    it('should return req.ips[0]', () => {
      const request = createRequest({
        headers: {
          'x-forwarded-for': '127.0.0.1'
        },
        socket: {
          remoteAddress: '127.0.0.2'
        }
      }, { proxy: true })

      assert.equal(request.ip, '127.0.0.1')
    })
  })

  describe('with no req.ips present', () => {
    it('should return req.socket.remoteAddress', () => {
      const request = createRequest({
        headers: {
          'x-forwarded-for': '127.0.0.1'
        },
        socket: {
          remoteAddress: '127.0.0.2'
        }
      })

      assert.equal(request.ip, '127.0.0.2')
    })

    describe('with req.socket.remoteAddress not present', () => {
      it('should return an empty string', () => {
        assert.equal(createRequest({ socket: {} }).ip, undefined)
      })
    })
  })

  // it('should be cached', () => {
  //   const req = { socket: {} }
  //   req.socket.remoteAddress = '127.0.0.2'
  //   const request = createRequest(req)
  //   req.socket.remoteAddress = '127.0.0.1'
  //   assert.equal(request.ip, '127.0.0.2')
  // })
})
