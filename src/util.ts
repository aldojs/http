
import { Stream } from 'stream'
import { ServerResponse } from 'http'

const HTML_RE = /^\s*</

/**
 * Check if the argument is a string
 * 
 * @param obj
 */
export function isString (obj: any): obj is string {
  return typeof obj === 'string'
}

/**
 * Check if the argument is an object
 * 
 * @param obj
 */
export function isObject (obj: any): obj is { [x: string]: any } {
  return obj && typeof obj === 'object'
}

/**
 * Check if the argument is a stream instance
 * 
 * @param obj
 */
export function isStream (obj: any): obj is Stream {
  return isObject(obj) && typeof obj.pipe === 'function'
}

/**
 * Check if the outgoing response is yet writable
 * 
 * @param res The server response stream
 */
export function isWritable (res: ServerResponse): boolean {
  // can't write any more after response finished
  if (res.finished) return false

  // pending writable outgoing response
  if (!res.connection) return true

  return res.connection.writable
}

/**
 * Guess the content type, default to `application/json`
 * 
 * @param content The response body
 * @private
 */
export function guessType (content: any): string {
  // string
  if (isString(content)) {
    return `text/${HTML_RE.test(content) ? 'html' : 'plain'}; charset=utf-8`
  }

  // buffer or stream
  if (Buffer.isBuffer(content) || isStream(content)) {
    return 'application/octet-stream'
  }

  // json
  return 'application/json; charset=utf-8'
}
