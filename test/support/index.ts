
import * as http from 'http'
import * as sinon from 'sinon'
import { Request, Response } from '../../src'

export function createRequest (req?: any, options?: { proxy: boolean }) {
  return new Request(_requestFrom(req), options)
}

export function createResponse (res?: any) {
  return new Response(_responseFrom(res))
}

export function createHttpServerStub () {
  return sinon.createStubInstance(http.Server)
}

/**
 * IncomingMessage stub
 * 
 * @param req
 * @private
 */
function _requestFrom (req?: any): any {
  return Object.assign({ headers: {}, socket: {} }, req)
}

/**
 * ServerResponse stub
 * 
 * @param res
 * @private
 */
function _responseFrom (res?: any): any {
  return Object.assign({
    headers: {} as any,

    getHeader (name: string) {
      return this.headers[name.toLowerCase()]
    },

    setHeader (name: string, value: any) {
      this.headers[name.toLowerCase()] = value
    },

    removeHeader (name: string) {
      delete this.headers[name.toLowerCase()]
    },

    hasHeader (name: string): boolean {
      return name.toLowerCase() in this.headers
    },

    getHeaders (): object {
      return this.headers
    },

    getHeaderNames (): string[] {
      return Object.keys(this.headers)
    }
  }, res)
}
