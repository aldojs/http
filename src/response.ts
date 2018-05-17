
import { Stream } from 'stream'
import * as assert from 'assert'
import is from '@sindresorhus/is'
import * as statuses from 'statuses'
import { contentType } from 'mime-types'
import { OutgoingHttpHeaders, ServerResponse } from 'http'

export class Response {
  /**
   * The response status code
   */
  public statusCode: number = 204

  /**
   * The response status message
   */
  public statusMessage: string = 'No Content'

  /**
   * The response body
   */
  public body: any = null

  /**
   * The response headers
   */
  public headers: OutgoingHttpHeaders = {}

  /**
   * Initialize a new response builder
   * 
   * @param content
   */
  public constructor (content?: any) {
    if (content != null) {
      this.body = content
      this.statusCode = 200
      this.statusMessage = 'OK'
    }
  }

  /**
   * Set the response status code
   * 
   * @param code The status code
   * @param message The status message
   */
  public status (code: number, message?: string): this {
    assert('number' === typeof code, 'The status code must be a number')
    assert(code >= 100 && code <= 999, 'Invalid status code')

    // no content status code
    if (this.body && statuses.empty[code]) this.body = null

    this.statusMessage = message || statuses[code] || ''
    this.statusCode = code

    return this
  }

  /**
   * Set `Content-Type` response header.
   * 
   * Will add the the charset if not present.
   * 
   * Examples:
   * 
   *     response.type('application/json')
   *     response.type('.html')
   *     response.type('html')
   *     response.type('json')
   *     response.type('png')
   */
  public type (value: string): this {
    let type = contentType(value)

    if (type) {
      this.set('Content-Type', type)
    }

    return this
  }

  /**
   * Set `Content-Length` reponse header
   */
  public length (value: number): this {
    return this.set('Content-Length', value)
  }

  /**
   * Set the `Last-Modified` response header
   */
  public lastModified (value: string | Date): this {
    if (is.string(value)) value = new Date(value)

    return this.set('Last-Modified', value.toUTCString())
  }

  /**
   * Set the `ETag` of the response.
   * 
   * This will normalize the quotes if necessary.
   * 
   * Examples:
   * 
   *     response.etag('md5hashsum')
   *     response.etag('"md5hashsum"')
   *     response.etag('W/"123456789"')
   */
  public etag (value: string): this {
    if (!/^(W\/)?"/.test(value)) value = `"${value}"`

    return this.set('ETag', value)
  }

  /**
   * Set the `Location` response header
   */
  public location (url: string): this {
    return this.set('Location', encodeURI(url))
  }

  /**
   * Append `field` to the `Vary` header
   */
  public vary (...headers: string[]): this {
    // match all
    if (headers.includes('*')) {
      return this.set('Vary', '*')
    }

    // first time
    if (!this.has('Vary')) {
      return this.set('Vary', String(headers))
    }

    let value = this.get('Vary') as string || ''

    // existing
    if (value !== '*') {
      for (let name of headers) {
        if (!value.includes(name)) value += `, ${name}`
      }

      this.set('Vary', value)
    }

    return this
  }

  /**
   * Append to the `Set-Cookie` header
   */
  public setCookie (cookie: string): this {
    return this.append('Set-Cookie', cookie)
  }

  /**
   * Get the response header if present, or undefined
   * 
   * @param header
   */
  public get (header: string): string | number | string[] | undefined {
    return this.headers[header.toLowerCase()]
  }

  /**
   * Set multiple headers at once
   * 
   * Examples:
   * 
   *    response.set({ 'Accept': 'text/plain', 'X-API-Key': 'tobi' })
   * 
   * @param headers
   */
  public set (headers: { [field: string]: string | number | string[] }): this

  /**
   * Set the response header
   * 
   * Examples:
   * 
   *    response.set('Foo', ['bar', 'baz'])
   *    response.set('Accept', 'application/json')
   * 
   * @param header
   * @param value
   */
  public set (header: string, value: string | number | string[]): this
  public set (header: any, value?: any) {
    if (is.object(header)) {
      for (let name in header)
        this.set(name, (header as any)[name])
    }
    else {
      this.headers[header.toLowerCase()] = value
    }

    return this
  }

  /**
   * Append additional header name
   * 
   * Examples:
   * 
   *    this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
   *    this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
   *    this.append('Warning', '199 Miscellaneous warning')
   * 
   * @param header
   * @param value
   */
  public append (header: string, value: string | string[]): this {
    if (this.has(header)) {
      let oldValue = this.get(header)

      if (!Array.isArray(oldValue)) {
        oldValue = [String(oldValue)]
      }

      value = oldValue.concat(value)
    }

    this.set(header, value)

    return this
  }

  /**
   * Check if response header is defined
   * 
   * @param header
   */
  public has (header: string): boolean {
    return this.get(header) !== undefined
  }

  /**
   * Remove the response header
   * 
   * @param header
   */
  public remove (header: string): this {
    delete this.headers[header.toLowerCase()]
    return this
  }

  /**
   * Reset all response headers
   * 
   * @param headers
   */
  public reset (headers: { [field: string]: string | number | string[] } = {}): this {
    this.headers = headers
    return this
  }

  /**
   * Send the response and terminate the stream
   * 
   * @param res The response stream
   * @public
   */
  public send (res: ServerResponse): void {
    let { statusCode, statusMessage, body: content, headers } = this

    // not writable
    if (!_isWritable(res)) return

    // status
    res.statusCode = statusCode
    res.statusMessage = statusMessage || statuses[statusCode] || ''

    // headers
    for (let field in headers) {
      res.setHeader(field, headers[field] as any)
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
    if (_isStream(content)) {
      content.pipe(res)
      return
    }

    // json
    if (!is.string(content) && !is.buffer(content)) {
      content = JSON.stringify(content)
    }

    // content length
    if (!res.hasHeader('Content-Length')) {
      res.setHeader('Content-Length', Buffer.byteLength(content))
    }

    // finish
    res.end(content)
  }
}

/**
 * Check if the outgoing response is yet writable
 * 
 * @param res The server response stream
 * @private
 */
function _isWritable (res: ServerResponse): boolean {
  // can't write any more after response finished
  if (res.finished) return false

  // pending writable outgoing response
  if (!res.connection) return true

  return res.connection.writable
}

const HTML_TAG_RE = /^\s*</

/**
 * Guess the content type, default to `application/json`
 * 
 * @param content The response body
 * @private
 */
function _guessType (content: any): string {
  // string
  if (is.string(content)) {
    return `text/${HTML_TAG_RE.test(content) ? 'html' : 'plain'}; charset=utf-8`
  }

  // buffer or stream
  if (is.buffer(content) || _isStream(content)) {
    return 'application/octet-stream'
  }

  // json
  return 'application/json; charset=utf-8'
}

/**
 * Check if the argument is a stream instance
 * 
 * @param obj
 * @private
 */
function _isStream (obj: any): obj is Stream {
  return obj && typeof obj.pipe === 'function'
}
