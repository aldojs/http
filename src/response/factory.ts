
import { Stream } from 'stream'
import is from '@sindresorhus/is'
import { Response } from './base'
import { JsonResponse } from './json'
import { contentType } from 'mime-types'
import { StreamResponse } from './stream'

const HTML_TAG_RE = /^\s*</

/**
 * Create a new response from the given content
 * 
 * @param content The response body
 * @public
 */
export function createResponse (content?: any): Response {
  if (_isResponseLike(content)) return content

  if (content == null) return createEmptyResponse()

  if (is.string(content)) {
    if (HTML_TAG_RE.test(content))
      return createHtmlResponse(content)
    else
      return createTextResponse(content)
  }

  if (is.buffer(content)) {
    return createBufferResponse(content)
  }

  if (_isStream(content)) {
    return createStreamResponse(content)
  }

  return createJsonResponse(content)
}

/**
 * Create a text response
 * 
 * @param text The response text body
 * @public
 */
export function createTextResponse (text: string): Response {
  return new Response(text)
    .set('Content-Type', 'text/plain; charset=utf-8')
    .set('Content-Length', Buffer.byteLength(text))
}

/**
 * Create a `HTML` response
 * 
 * @param html The response `HTML` body
 * @public
 */
export function createHtmlResponse (html: string): Response {
  return createTextResponse(html).set('Content-Type', 'text/html; charset=utf-8')
}

/**
 * Create a `Buffer` response
 * 
 * @param buffer The response buffer
 * @public
 */
export function createBufferResponse (buffer: Buffer): Response {
  return new Response(buffer)
    .set('Content-Length', buffer.length)
    .set('Content-Type', 'application/octet-stream')
}

/**
 * Create an empty response
 * 
 * @public
 */
export function createEmptyResponse (): Response {
  return new Response(null)
}

/**
 * Create a `JSON` response
 * 
 * @param json The response body
 * @public
 */
export function createJsonResponse (json: object): JsonResponse {
  return new JsonResponse(json)
}

/**
 * Create a streamed response
 * 
 * @param stream The stream object
 * @public
 */
export function createStreamResponse (stream: Stream): StreamResponse {
  return new StreamResponse(stream)
}

/**
 * Create an error response
 * 
 * @param err The error object
 * @public
 */
export function createErrorResponse (err: any): Response {
  let body = err.expose ? err.message : 'Internal Server Error'
  let status = err.status || err.statusCode || 500
  let response = new Response(body)

  response.set(err.headers || {})
  response.status(status)

  return response
}

/**
 * Check if the given value is a `Response` instance
 * 
 * @param value
 * @private
 */
function _isResponseLike (value: any): boolean {
  if (value instanceof Response) return true

  return value != null && is.function_(value.send)
}

/**
 * Check if the argument is a stream instance
 * 
 * @param obj
 * @private
 */
function _isStream (obj: any): obj is Stream {
  return obj && is.function_(obj.pipe)
}
