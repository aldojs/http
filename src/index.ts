
import Server from './server'
import Request from './request'
import Response from './response'

/**
 * Create a HTTP Server
 * 
 * @param {Object} [options]
 * @param {Function} [fn]
 * @returns {Server}
 */
export function createServer (options?: object, fn?: (req: Request, res: Response) => void): Server
export function createServer (fn?: (req: Request, res: Response) => void): Server
export function createServer (options?: any, fn?: any) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  var server = new Server(options)

  fn && server.on('request', fn)

  return server
}

export { Request, Response }
