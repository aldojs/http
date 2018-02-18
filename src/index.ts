
import Server from './server'
import Request from './request'
import Response from './response'

/**
 * Create HTTP Server
 * 
 * @param {Function} fn
 * @returns {Server}
 */
export function createServer (fn?: (req: Request, res: Response) => void) {
  var server = new Server()

  fn && server.on('request', fn)

  return server
}

export { Request, Response }
