
import * as http from 'http'
import * as assert from 'assert'
import * as mime from 'mime-types'
import * as statuses from 'statuses'
import * as cookie from './support/cookie'
import * as ct from './support/content-type'

export default class Response {
  /**
   * Response internal body
   */
  private _body: any = null

  /**
   * Construct a new response instance
   * 
   * @param stream
   * @param options
   */
  public constructor (public stream: http.ServerResponse, options = {}) {
    // 
  }

  /**
   * Response headers
   * 
   * Shortcut to `this.stream.getHeaders()`
   */
  public get headers (): http.OutgoingHttpHeaders {
    return this.stream.getHeaders()
  }

  /**
   * Set the response status code
   */
  public set status (code: number) {
    // skip
    if (this.stream.headersSent) return

    assert('number' === typeof code, 'The status code must be a number')
    assert(code >= 100 && code <= 999, 'Invalid status code')

    this.stream.statusCode = code
    this.message = statuses[code] || ''

    if (this.body && statuses.empty[code]) this.body = null
  }

  /**
   * Get the response status code
   */
  public get status (): number {
    return this.stream.statusCode
  }

  /**
   * Set the response status message
   */
  public set message (value: string) {
    this.stream.statusMessage = value
  }

  /**
   * Get the response status message
   */
  public get message (): string {
    return this.stream.statusMessage || statuses[this.status] || ''
  }

  /**
   * Set `Content-Type` response header.
   * 
   * Will add the the charset if not present.
   * 
   * Examples:
   * 
   *     response.type = 'application/json'
   *     response.type = '.html'
   *     response.type = 'html'
   *     response.type = 'json'
   *     response.type = 'png'
   */
  public set type (value: string) {
    var ct = mime.contentType(value)

    if (ct) this.stream.setHeader('Content-Type', ct)
  }

  /**
   * Return the response mime type void of the "charset" parameter, or undefined
   */
  public get type (): string {
    return ct.extract(this.get('Content-Type') as string) as string
  }

  /**
   * Set `Content-Length` reponse header
   */
  public set length (value: number) {
    this.stream.setHeader('Content-Length', value)
  }

  /**
   * Get the response content length or NaN otherwise.
   */
  public get length (): number {
    return this.get('Content-Length') as number || NaN
  }

  /**
   * Get the response body
   */
  public get body (): any {
    return this._body
  }

  /**
   * Set the response body
   */
  public set body (value: any) {
    this._body = value

    // empty body
    if (value == null) {
      if (!statuses.empty[this.status]) this.status = 204

      this.remove('Transfer-Encoding')
      this.remove('Content-Length')
      this.remove('Content-type')
      return
    }

    // status code
    if (!this.status) this.status = 200

    // string
    if (typeof value === 'string') {
      if (!this.has('Content-Type')) {
        let type = /^\s*</.test(value) ? 'html' : 'plain'

        this.set('Content-Type', `text/${type}; charset=utf-8`)
      }

      this.set('Content-Length', Buffer.byteLength(value))
      return
    }

    // buffer
    if (Buffer.isBuffer(value)) {
      if (!this.has('Content-Type')) {
        this.set('Content-Type', 'application/octet-stream')
      }

      this.set('Content-Length', value.length)
      return
    }

    // json
    this._body = value = JSON.stringify(value)
    this.set('Content-Length', Buffer.byteLength(value))

    if (!this.has('Content-Type')) {
      this.set('Content-Type', 'application/json; charset=utf-8')
    }
  }

  /**
   * Set the `Last-Modified` response header
   */
  public set lastModified (value: Date) {
    this.stream.setHeader('Last-Modified', value.toUTCString())
  }

  /**
   * Get the `Last-Modified` date, or undefined if not present
   */
  public get lastModified (): Date {
    var date = this.get('Last-Modified') as string

    return date ? new Date(date) : undefined as any
  }

  /**
   * Set the `ETag` of the response.
   * 
   * This will normalize the quotes if necessary.
   * 
   * Examples:
   * 
   *     response.etag = 'md5hashsum'
   *     response.etag = '"md5hashsum"'
   *     response.etag = 'W/"123456789"'
   */
  public set etag (value: string) {
    if (!/^(W\/)?"/.test(value)) value = `"${value}"`

    this.stream.setHeader('ETag', value)
  }

  /**
   * Get the `ETag` of the response.
   */
  public get etag (): string {
    return this.get('ETag') as string
  }

  /**
   * Set the `Location` response header
   */
  public set location (url: string) {
    this.stream.setHeader('Location', encodeURI(url))
  }

  /**
   * Get the `Location` response header
   */
  public get location (): string {
    return this.get('Location') as string
  }

  /**
   * Append `field` to the `Vary` header
   * 
   * @param field
   */
  public vary (field: string | string[]): this {
    // skip
    if (this.stream.headersSent) return this

    // match all
    if (field.includes('*')) {
      this.stream.setHeader('Vary', '*')
      return this
    }

    // first time
    if (!this.stream.hasHeader('Vary')) {
      this.stream.setHeader('Vary', String(field))
      return this
    }

    var value = this.get('Vary') as string || ''

    // existing
    if (value !== '*') {
      let array = Array.isArray(field) ? field : field.split(/\s*,\s*/)

      for (let item of array) {
        if (!value.includes(item)) value += `, ${item}`
      }

      this.stream.setHeader('Vary', value)
    }

    return this
  }

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * 
   * It returns the first matching type or false otherwise.
   * 
   * Pretty much the same as `Request.is()`
   * 
   * @param types
   */
  public is (...types: string[]): string | false {
    return ct.is(this.type, types)
  }

  /**
   * Get the response header if present, or undefined
   * 
   * @param header
   */
  public get (header: string): string | number | string[] | undefined {
    return this.stream.getHeader(header)
  }

  /**
   * Set the response header, or pass an object of header fields.
   * 
   * Examples:
   * 
   *    response.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
   * 
   * @param headers
   */
  public set (headers: { [field: string]: string | number | string[] }): this
  /**
   * Set the response header, or pass an object of header fields.
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
    if (typeof header === 'string') {
      this.stream.setHeader(header, value)
    }
    else if (typeof header === 'object') {
      for (let name in header) {
        this.stream.setHeader(name, header[name])
      }
    }

    return this
  }

  /**
   * Set cookie `name` to `value`, with the given `options`.
   * 
   * Examples:
   * 
   *    // "Remember Me" for 15 minutes
   *    res.cookie('remember', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
   * 
   *    // same as above
   *    res.cookie('remember', '1', { maxAge: 900000, httpOnly: true })
   * 
   * @param name
   * @param value
   * @param options
   */
  public setCookie (name: string, value: string, options?: cookie.SerializeOptions) {
    return this.append('Set-Cookie', cookie.serialize(name, value, options))
  }

  /**
   * Unset the cookie `name`.
   * 
   * @param name
   * @param options
   */
  public clearCookie (name: string, options?: cookie.SerializeOptions) {
    return this.setCookie(name, '', { expires: new Date(0), ...options })
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
  public append (header: string, value: string | string[]) {
    if (this.stream.hasHeader(header)) {
      let oldValue = this.stream.getHeader(header)

      if (!Array.isArray(oldValue)) {
        oldValue = [String(oldValue)]
      }

      value = oldValue.concat(value)
    }

    this.stream.setHeader(header, value)
    return this
  }

  /**
   * Check if response header is defined
   * 
   * @param header
   */
  public has (header: string): boolean {
    return this.stream.hasHeader(header)
  }

  /**
   * Remove the response header
   * 
   * @param header
   */
  public remove (header: string) {
    this.stream.removeHeader(header)
    return this
  }

  /**
   * Reset all response headers
   * 
   * @param headers
   */
  public reset (headers?: { [field: string]: string | number | string[] }): this {
    for (let header of this.stream.getHeaderNames()) {
      this.stream.removeHeader(header)
    }

    if (headers) this.set(headers)

    return this
  }

  /**
   * Send and end the response stream
   * 
   * @param content
   */
  public send (content?: any): void {
    // already sent
    if (this.stream.finished) return

    // body
    if (content) this.body = content

    var { body, status, stream: res } = this

    // no content
    if (!status) this.status = status = 204

    // ignore body
    if (statuses.empty[status]) {
      res.end()
      return
    }

    // status body
    if (body == null) {
      res.setHeader('Content-Length', Buffer.byteLength(body = this.message))
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    }

    // finish
    res.end(body)
  }
}

function _skipDuplicates (all: string[], current: string): string[] {
  if (!all.includes(current.toLowerCase())) {
    all.push(current)
  }

  return all
}
