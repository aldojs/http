
import * as http from 'http'
import * as assert from 'assert'
import * as typeis from 'type-is'
import * as mime from 'mime-types'
import * as statuses from 'statuses'
import * as cookie from './support/cookie'
import * as negotiator from './support/negotiator'

const HTML_ESCAPE_RE = /[<>"'&]/g

export default class Response {
  private _body: any
  private _sent = false

  constructor (public req: http.IncomingMessage, public res: http.ServerResponse) {
    // 
  }

  get headers (): http.OutgoingHttpHeaders {
    return this.res.getHeaders()
  }

  set status (code: number) {
    assert('number' === typeof code, 'The status code must be a number')
    assert(code >= 100 && code <= 999, 'Invalid status code')

    if (this.body && statuses.empty[code]) this.body = null

    this.message = statuses[code] || ''
    this.res.statusCode = code
  }

  get status (): number {
    return this.res.statusCode
  }

  set message (value: string) {
    this.res.statusMessage = value
  }

  get message (): string {
    return this.res.statusMessage || statuses[this.status] || ''
  }

  set type (value: string) {
    var ct = mime.contentType(value)

    if (ct) this.set('Content-Type', ct)
  }

  get type (): string {
    var ct = <string> this.get('Content-Type')

    return ct ? ct.split(';')[0].trim() : ''
  }

  set length (value: number) {
    this.set('Content-Length', value)
  }

  get length (): number {
    return this.headers['content-length'] as number
  }

  get body (): any {
    return this._body
  }

  set body (value: any) {
    this._body = value

    // empty body
    if (value == null) {
      this.remove('Transfer-Encoding')
      this.remove('Content-Length')
      this.remove('Content-type')
      this.status = 204
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
    }

    // buffer
    else if (Buffer.isBuffer(value)) {
      if (!this.has('Content-Type'))
        // binary
        this.set('Content-Type', 'application/octet-stream')
    }

    // json
    else if (typeof value === 'object') {
      value = JSON.stringify(value)
      this.set('Content-Type', 'application/json; charset=utf-8')
    }

    this.length = Buffer.byteLength(value)
  }

  /**
   * @type {Date}
   */
  set lastModified (value: Date) {
    this.set('Last-Modified', value.toUTCString())
  }

  /**
   * @type {Date | undefined}
   */
  get lastModified (): Date {
    var date = <string> this.get('last-modified')

    return date ? new Date(date) : undefined as any
  }

  set etag (value: string) {
    if (!/^(W\/)?"/.test(value)) value = `"${value}"`

    this.set('ETag', value)
  }

  get etag (): string {
    return <string> this.get('ETag')
  }

  is (...types: string[]): string | false {
    return typeis.is(this.type, types)
  }

  get (header: string): string | number | string[] {
    return this.res.getHeader(header) || ''
  }

  set (headers: { [field: string]: string | number | string[] }): this
  set (header: string, value: string | number | string[]): this
  set (header: any, value?: any) {
    if (typeof header === 'object') {
      for (let name in header) {
        this.res.setHeader(name, header[name])
      }

      return this
    }

    this.res.setHeader(header, value)
    return this
  }

  setCookie (name: string, value: string, options?: cookie.SerializeOptions) {
    this.append('Set-Cookie', cookie.serialize(name, value, options))
    return this
  }

  append (header: string, value: string | string[]) {
    if (this.has(header)) {
      let oldValue = this.get(header)

      if (!Array.isArray(oldValue)) {
        oldValue = [String(oldValue)]
      }

      value = oldValue.concat(value)
    }

    return this.set(header, value)
  }

  has (header: string): boolean {
    return this.res.hasHeader(header)
  }

  remove (header: string) {
    this.res.removeHeader(header)
    return this
  }

  /**
   * Reset response headers
   */
  reset () {
    for (let header of this.res.getHeaderNames()) {
      this.remove(header)
    }

    return this
  }

  redirect (url = '/', status = 302) {
    // header
    this.set('Location', url)

    // status
    if (!statuses.redirect[this.status]) this.status = status

    // html
    if (negotiator.accept(this.req, ['text/html'])) {
      url = _escape(url)

      this.set('Content-Type', 'text/html; charset=utf-8')
      this.body = `Redirecting to <a href="${url}">${url}</a>.`

      return
    }

    // text
    this.body = `Redirecting to ${url}.`
  }

  send (content?: any) {
    // already sent
    if (this._sent) return

    // body
    if (content) this.body = content

    var { body, status, res } = this

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
    this._sent = true
  }
}

/**
 * Escape HTML strings
 * 
 * @param {String} html
 */
function _escape (html: string): string {
  return html.replace(HTML_ESCAPE_RE, (match) => `&#${match.charCodeAt(0)};`)
}
