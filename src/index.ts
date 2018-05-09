
import * as http from 'http'
import Server from './server'
import * as https from 'https'
import { Listener } from './response'

interface Options {
  // [x: string]: any
  tls?: https.ServerOptions
}

/**
 * Create a HTTP(S) Server
 * 
 * @param fn
 * @param options
 */
export function createServer (fn: Listener, { tls }: Options = {}): Server {
  return new Server(_createNativeServer(tls)).on('request', fn)
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
