
import { Request, Response } from '../../src'

export function createRequest (req?: any) {
  return new Request(_requestFrom(req))
}

export function createResponse (res?: any) {
  return new Response(_responseFrom(res))
}

/**
 * IncomingMessage stub
 * 
 * @param {Object} req
 * @returns {Object}
 * @private
 */
function _requestFrom (req?: any): any {
  return Object.assign({ headers: {}, socket: {} }, req)
}

/**
 * ServerResponse stub
 * 
 * @param {Object} res
 * @returns {Object}
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
