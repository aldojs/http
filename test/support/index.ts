
import Request from '../../src/request'
import Response from '../../src/response'

export function createRequest (req?: any, res?: any) {
  return new Request(_requestFrom(req), _responseFrom(res))
}

export function createResponse (req?: any, res?: any) {
  return new Response(_requestFrom(req), _responseFrom(res))
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
