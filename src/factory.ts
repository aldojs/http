
import * as http from 'http'
import * as https from 'https'
import { Server, RequestHandler } from './server'

export type CreateServerOptions = {
  tls?: https.ServerOptions
}

/**
 * Create a HTTP(S) Server
 * 
 * @param options The `Server` options
 * @param handler The request handler
 * @public
 */
export function createServer (options: CreateServerOptions, handler: RequestHandler): Server

/**
 * Create a HTTP(S) Server
 * 
 * @param options The `Server` options
 * @public
 */
export function createServer (options: CreateServerOptions): Server

/**
 * Create a HTTP(S) Server
 * 
 * @param handler The request handler
 * @public
 */
export function createServer (handler: RequestHandler): Server

/**
 * Create a HTTP(S) server
 * 
 * @public
 */
export function createServer (): Server

export function createServer (options: any = {}, fn?: any) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  let server = new Server(_createNativeServer(options.tls))

  if (fn) server.on('request', fn)

  return server
}

/**
 * Create native server
 * 
 * @param tls Secure server options
 * @private
 */
function _createNativeServer (tls?: https.ServerOptions): http.Server | https.Server {
  return tls ? https.createServer(tls) : http.createServer()
}
