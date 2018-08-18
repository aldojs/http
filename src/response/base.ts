
import { Stream } from 'stream'
import is from '@sindresorhus/is'
import { contentType } from 'mime-types'
import { OutgoingHttpHeaders, ServerResponse, IncomingMessage } from 'http'

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
   * @param body The response body
   * @constructor
   * @public
   */
  public constructor (body: any) {
    if (body != null) {
      this.body = body
      this.statusCode = 200
      this.statusMessage = 'OK'
    }
  }

  /**
   * Set the response status code
   * 
   * @param code The status code
   * @param reasonPhase The status message
   * @throws `TypeError` if the status code is not a number
   * @throws `RangeError` if the status code is smaller than 100 or larger than 999
   */
  public status (code: number, reasonPhase = ''): this {
    if (!is.number(code)) {
      throw new TypeError('The status code must be a number')
    }

    if (code < 100 || code > 999) {
      throw new RangeError('The status code should be between 100 and 999')
    }

    this.statusMessage = reasonPhase
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

    if (!type) return this

    return this.set('Content-Type', type)
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

    return this.set(header, value)
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
    // ignore
    if (!this._isWritable(res)) return

    // head
    this._writeHeaders(res)

    // body
    res.end(this.body)
  }

  /**
   * Write the status code and the headers
   * 
   * @param res The outgoing response
   * @private
   */
  protected _writeHeaders (res: ServerResponse): void {
    // ignore
    if (res.headersSent) return

    // status
    res.statusCode = this.statusCode
    res.statusMessage = this.statusMessage

    // headers
    for (let field in this.headers) {
      res.setHeader(field, this.headers[field] as any)
    }
  }

  /**
   * Check if the outgoing response is yet writable
   * 
   * @param res The server response stream
   * @private
   */
  protected _isWritable (res: ServerResponse): boolean {
    // can't write any more after response finished
    if (res.finished === true) return false
  
    // pending writable outgoing response
    if (!res.connection) return true
  
    return res.connection.writable
  }
}
