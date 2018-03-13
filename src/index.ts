
import * as http from 'http'
import Server from './server'
import * as https from 'https'
import Request from './request'
import Response from './response'

export interface Options {
  proxy?: boolean
  tls?: https.ServerOptions
}

export { Request, Response, Server }

/**
 * Create a HTTP Server
 */
export function createServer (): Server
/**
 * Create a HTTP Server
 * 
 * @param options
 */
export function createServer (options: Options): Server
/**
 * Create a HTTP Server
 * 
 * @param fn
 */
export function createServer (fn: (req: Request, res: Response) => void): Server
/**
 * Create a HTTP Server
 * 
 * @param options
 * @param fn
 */
export function createServer (options: Options, fn: (req: Request, res: Response) => void): Server
export function createServer (options: any = {}, fn?: any) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  var server = new Server(_createServer(options.tls), options)

  fn && server.on('request', fn)

  return server
}

/**
 * Create native server
 * 
 * @param tls secure server options
 * @private
 */
function _createServer (tls?: https.ServerOptions): http.Server | https.Server {
  return tls ? https.createServer(tls) : http.createServer()
}
