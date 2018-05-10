
import { Stream } from 'stream'
import { ServerResponse } from 'http'

/**
 * Check if the argument is a string
 * 
 * @param obj
 */
export function isString (obj: any): obj is string {
  return typeof obj === 'string'
}

/**
 * Check if the status code is a valid number
 * 
 * @param status
 */
export function isValid (status: any): status is number {
  return typeof status === 'number' && status >= 100 && status <= 999
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
 * Check if the argument is a buffer object
 * 
 * @param obj
 */
export function isBuffer (obj: any): obj is Buffer {
  return Buffer.isBuffer(obj)
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
