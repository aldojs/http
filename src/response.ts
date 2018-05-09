
import * as http from 'http'
import * as statuses from 'statuses'
import { isStream, isString, isWritable, isBuffer } from './util'

const HTML_TAG_RE = /^\s*</

export interface Response {
  readonly body?: any
  readonly statusCode: number
  readonly statusMessage?: string
  readonly headers?: { [x: string]: string | number | string[] }
}

export type Listener = (request: http.IncomingMessage) => Response | Promise<Response>

/**
 * Handle the incoming request
 * 
 * @param fn The request listener
 * @param req The incoming message stream
 * @param res The outgoing response stream
 */
export function handle (fn: Listener, req: http.IncomingMessage, res: http.ServerResponse): void {
  _getResponse(fn, req).then((response) => _send(res, response))
}

/**
 * Invoke the request listener and return the response
 * 
 * @param fn
 * @param req
 * @private
 */
async function _getResponse (fn: Listener, req: any): Promise<Response> {
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
 * Send the response and terminate the stream
 * 
 * @param res The response stream
 * @param response The response interface
 * @private
 */
function _send (res: http.ServerResponse, response: Response): void {
  // writable
  if (!isWritable(res)) return

  // no content
  if (response == null) {
    res.statusMessage = 'No Content'
    res.statusCode = 204
    res.end()
    return
  }

  let { statusCode, statusMessage, body: content, headers = {} } = response

  // status
  res.statusCode = statusCode
  res.statusMessage = statusMessage || statuses[statusCode] || ''

  // headers
  for (let field in headers) {
    res.setHeader(field, headers[field])
  }

  // ignore body
  if (statuses.empty[statusCode]) {
    res.removeHeader('Transfer-Encoding')
    res.removeHeader('Content-Length')
    res.removeHeader('Content-type')
    res.end()
    return
  }

  // status body
  if (content == null) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(res.statusMessage || String(statusCode))
    return
  }

  // content type
  if (!res.hasHeader('Content-Type')) {
    res.setHeader('Content-Type', _guessType(content))
  }

  // string or buffer
  if (isString(content) || isBuffer(content)) {
    res.end(content)
    return
  }

  // stream
  if (isStream(content)) {
    content.pipe(res)
    return
  }

  // json
  res.end(JSON.stringify(content))
}

/**
 * Guess the content type, default to `application/json`
 * 
 * @param content The response body
 * @private
 */
export function _guessType (content: any): string {
  // string
  if (isString(content)) {
    return `text/${HTML_TAG_RE.test(content) ? 'html' : 'plain'}; charset=utf-8`
  }

  // buffer or stream
  if (Buffer.isBuffer(content) || isStream(content)) {
    return 'application/octet-stream'
  }

  // json
  return 'application/json; charset=utf-8'
}
