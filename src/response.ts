
import * as http from 'http'
import * as assert from 'assert'
import * as mime from 'mime-types'
import * as statuses from 'statuses'
import * as cookie from './support/cookie'
import * as ct from './support/content-type'
import * as negotiator from './support/negotiator'

export default class Response {
  private _body: any

  constructor (public stream: http.ServerResponse) {
    // 
  }

  get headers (): http.OutgoingHttpHeaders {
    return this.stream.getHeaders()
  }

  set status (code: number) {
    assert('number' === typeof code, 'The status code must be a number')
    assert(code >= 100 && code <= 999, 'Invalid status code')

    this.stream.statusCode = code
    this.message = statuses[code] || ''

    if (this.body && statuses.empty[code]) this.body = null
  }

  get status (): number {
    return this.stream.statusCode
  }

  set message (value: string) {
    this.stream.statusMessage = value
  }

  get message (): string {
    return this.stream.statusMessage || statuses[this.status] || ''
  }

  set type (value: string | undefined) {
    var ct = mime.contentType(value as string)

    if (ct) this.stream.setHeader('Content-Type', ct)
  }

  get type (): string | undefined {
    return ct.extract(this.headers['content-type'] as string)
  }

  set length (value: number) {
    this.stream.setHeader('Content-Length', value)
  }

  get length (): number {
    return this.headers['content-length'] as number || NaN
  }

  get body (): any {
    return this._body || null
  }

  set body (value: any) {
    this._body = value

    // empty body
    if (value == null) {
      if (!statuses.empty[this.status]) this.status = 204

      this.stream.removeHeader('Transfer-Encoding')
      this.stream.removeHeader('Content-Length')
      this.stream.removeHeader('Content-type')

      return
    }

    // status code
    if (!this.status) this.status = 200

    // string
    if (typeof value === 'string') {
      if (!this.stream.hasHeader('Content-Type')) {
        let type = /^\s*</.test(value) ? 'html' : 'plain'

        this.stream.setHeader('Content-Type', `text/${type}; charset=utf-8`)
      }

      this.stream.setHeader('Content-Length', Buffer.byteLength(value))

      return
    }

    // buffer
    if (Buffer.isBuffer(value)) {
      if (!this.stream.hasHeader('Content-Type')) {
        this.stream.setHeader('Content-Type', 'application/octet-stream')
      }

      this.stream.setHeader('Content-Length', value.length)

      return
    }

    // json
    this._body = value = JSON.stringify(value)
    this.stream.setHeader('Content-Length', Buffer.byteLength(value))
    this.stream.setHeader('Content-Type', 'application/json; charset=utf-8')
  }

  set lastModified (value: Date) {
    this.stream.setHeader('Last-Modified', value.toUTCString())
  }

  get lastModified (): Date {
    var date = this.headers['last-modified'] as string

    return date ? new Date(date) : undefined as any
  }

  set etag (value: string) {
    if (!/^(W\/)?"/.test(value)) value = `"${value}"`

    this.stream.setHeader('ETag', value)
  }

  get etag (): string {
    return this.headers.etag as string
  }

  set location (url: string) {
    this.stream.setHeader('Location', url)
  }

  get location (): string {
    return this.headers.location as string
  }

  is (...types: string[]): string | false {
    return ct.is(this.type, types)
  }

  get (header: string): string | number | string[] {
    return this.stream.getHeader(header) || ''
  }

  set (headers: { [field: string]: string | number | string[] }): this
  set (header: string, value: string | number | string[]): this
  set (header: any, value?: any) {
    if (typeof header === 'object') {
      for (let name in header) {
        this.stream.setHeader(name, header[name])
      }

      return this
    }

    this.stream.setHeader(header, value)
    return this
  }

  setCookie (name: string, value: string, options?: cookie.SerializeOptions) {
    return this.append('Set-Cookie', cookie.serialize(name, value, options))
  }

  clearCookie (name: string) {
    return this.setCookie(name, '', { expires: new Date(0) })
  }

  append (header: string, value: string | string[]) {
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

  has (header: string): boolean {
    return this.stream.hasHeader(header)
  }

  remove (header: string) {
    this.stream.removeHeader(header)
    return this
  }

  /**
   * Reset response headers
   */
  reset () {
    for (let header of this.stream.getHeaderNames()) {
      this.stream.removeHeader(header)
    }

    return this
  }

  send (content?: any) {
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
