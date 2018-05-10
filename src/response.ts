
import * as http from 'http'
import * as assert from 'assert'
import * as statuses from 'statuses'
import { isStream, isString, isWritable, isBuffer, isObject, isValid } from './util'

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
    let response = await fn(req)

    assert(isObject(response), 'The response must be an object')
    assert(isValid(response.statusCode), 'The status code is invalid')

    return response
  } catch (error) {
    // TODO: should log the error somewhere

    let status = error.status || error.statusCode

    // support ENOENT
    if (error.code === 'ENOENT') status = 404

    return {
      statusCode: isValid(status) ? status : 500,
      body: error.expose ? error.message : 'Internal Server Error',
      headers: error.headers || { 'Content-Type': 'text/plain; charset=utf-8' }
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
  let { statusCode, statusMessage, body: content, headers = {} } = response

  // not writable
  if (!isWritable(res)) return

  // status
  res.statusCode = statusCode
  res.statusMessage = statusMessage || statuses[statusCode] || ''

  // headers
  for (let field in headers) {
    res.setHeader(field, headers[field])
  }

  // ignore body
  if (statuses.empty[statusCode] || content == null) {
    res.removeHeader('Transfer-Encoding')
    res.removeHeader('Content-Length')
    res.removeHeader('Content-type')
    res.end()
    return
  }

  // content type
  if (!res.hasHeader('Content-Type')) {
    res.setHeader('Content-Type', _guessType(content))
  }

  // stream
  if (isStream(content)) {
    content.pipe(res)
    return
  }

  // json
  if (!isString(content) && !isBuffer(content)) {
    content = JSON.stringify(content)
  }

  // content length
  if (!res.hasHeader('Content-Length')) {
    res.setHeader('Content-Length', Buffer.byteLength(content))
  }

  // finish
  res.end(content)
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
