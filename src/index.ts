
import * as http from 'http'
import Server from './server'
import * as https from 'https'
import { Stream } from 'stream'
import * as statuses from 'statuses'
import { isStream, isString, isWritable } from './util'

interface Options {
  // [x: string]: any
  tls?: https.ServerOptions
}

interface Response {
  readonly body?: any
  readonly statusCode: number
  readonly statusMessage?: string
  readonly headers?: { [x: string]: string | number | string[] }
}

type Listener = (request: http.IncomingMessage) => Response | Promise<Response>

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
