
import * as http from 'http'
import Server from './server'
import * as https from 'https'
import { Stream } from 'stream'

interface Options {
  // [x: string]: any
  tls?: https.ServerOptions
}

interface Response {
  statusCode: number
  statusMessage?: string
  body?: string | Buffer | Stream
  headers?: { [x: string]: string | number | string[] }
}

type Listener = (request: http.IncomingMessage) => Response

/**
 * Create a HTTP(S) Server
 * 
 * @param fn
 * @param options
 */
export function createServer (fn: Listener, { tls }: Options = {}): Server {
  return _createServer(tls).on('request', _wrapListener(fn))
}

/**
 * Create native server
 * 
 * @param tls Secure server options
 * @private
 */
function _createServer (tls?: https.ServerOptions): Server {
  return new Server(tls ? https.createServer(tls) : http.createServer())
}

/**
 * Create the request listener wrapper
 * 
 * @private
 */
function _wrapListener (fn: Listener) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    _tryListener(fn, req).then((response) => _send(res, response))
  }
}

/**
 * Invoke the request listener and return the response
 * 
 * @param fn
 * @param req
 */
async function _tryListener (fn: (req: any) => Response, req: any): Promise<Response> {
  try {
    return await fn(req)
  } catch (error) {
    // file not found error
    if (error.code === 'ENOENT') error.status = 404

    return {
      headers: error.headers || {},
      statusCode: error.status || error.statusCode || 500,
      body: error.expose ? error.message : 'Internal Server Error'
    }
  }
}

/**
 * Check the given argument is a stream like
 * 
 * @private
 */
function _isStream (obj: any): obj is Stream {
  return obj && typeof obj.pipe === 'function'
}

/**
 * Check if the outgoing response is yet writable
 * 
 * @param res The server response stream
 * @private
 */
function _isWritable (res: http.ServerResponse): boolean {
  // can't write any more after response finished
  if (res.finished) return false

  // pending writable outgoing response
  if (!res.connection) return true

  return res.connection.writable
}

/**
 * Send the response and terminate the stream
 * 
 * @param res The response stream
 * @param response The response interface
 * @private
 */
function _send (res: http.ServerResponse, response: Response): void {
  if (!_isWritable(res)) return

  // no content
  if (response == null) {
    res.statusMessage = 'No Content'
    res.statusCode = 204
    res.end()
    return
  }

  let { statusCode, statusMessage, body, headers } = response
  
  res.statusCode = statusCode

  if (statusMessage) res.statusMessage = statusMessage

  if (headers) {
    for (let field in headers) {
      res.setHeader(field, headers[field])
    }
  }

  // status body
  if (!body) body = statusMessage || String(statusCode)

  _isStream(body) ? body.pipe(res) : res.end(body)
}
