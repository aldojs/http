
import * as http from 'http'
import * as url from './support/url'
import * as cookie from './support/cookie'
import * as qs from './support/query-string'
import * as ct from './support/content-type'
import * as charset from './support/charset'
import * as negotiator from './support/negotiator'

export type Options = {
  proxy?: boolean
}

export default class Request {
  /**
   * Request body
   * 
   * @type {Any}
   */
  public body: any = null

  /**
   * 
   * 
   * @type {Boolean}
   */
  private _proxy: boolean

  /**
   * Contruct a new request instance
   * 
   * @param {http.IncomingMessage} stream
   * @param {Object} [options]
   * @constructor
   */
  public constructor (public stream: http.IncomingMessage, options: Options = {}) {
    this._proxy = options.proxy || false
  }

  /**
   * Request headers
   * 
   * @type {Object}
   */
  public get headers (): http.IncomingHttpHeaders {
    return this.stream.headers
  }

  /**
   * Get the parsed cookies object
   * 
   * @type {Object}
   */
  public get cookies (): { [x: string]: string | undefined } {
    return cookie.parse(this.stream)
  }

  /**
   * URL pathname
   * 
   * @type {String}
   */
  public  get url (): string {
    return url.parse(this.stream).pathname || '/'
  }

  /**
   * Request method
   * 
   * @type {String}
   */
  public get method (): string {
    return this.stream.method || 'GET'
  }

  /**
   * URL query string
   * 
   * @type {String}
   */
  public get querystring (): string {
    return url.parse(this.stream).query as string || ''
  }

  /**
   * Request mime type, void of parameters such as "charset", or undefined
   * 
   * @type {String | undefined}
   */
  public get type (): string | undefined {
    return ct.extract(this.headers['content-type'] as string)
  }

  /**
   * Get the charset when present or undefined
   * 
   * @type {String | undefined}
   */
  public get charset (): string | undefined {
    return charset.extract(this.headers['content-type'] as string)
  }

  /**
   * Returns the parsed Content-Length when present or NaN
   * 
   * @type {Number}
   */
  public get length (): number {
    var len = this.headers['content-length'] as string

    return len ? Number(len) : NaN
  }

  /**
   * Get the parsed query string
   * 
   * @type {Object}
   */
  public get query (): { [key: string]: string | string[] | undefined } {
    return qs.parse(this.stream)
  }

  /**
   * Returns true when requested with TLS, false otherwise
   * 
   * @type {Boolean}
   */
  public get secure (): boolean {
    return this.protocol === 'https'
  }

  /**
   * "Host" header value
   * 
   * @type {String | undefined}
   */
  public get host (): string | undefined {
    if (this._proxy === true) {
      let host = this.headers['x-forwarded-host']

      // parse
      if (typeof host === 'string') {
        host = this.headers['x-forwarded-host'] = host.split(/\s*,\s*/)
      }

      if (host && host[0]) return host[0]
    }

    return this.headers.host as string
  }

  /**
   * Return the protocol string "http" or "https" when requested with TLS
   * 
   * @type {String}
   */
  public get protocol (): string {
    if ((this.stream.socket as any).encrypted) return 'https'

    if (this._proxy === true) {
      let proto = this.headers['x-forwarded-proto']

      // parse
      if (typeof proto === 'string') {
        proto = this.headers['x-forwarded-proto'] = proto.split(/\s*,\s*/)
      }

      if (proto && proto[0]) return proto[0]
    }

    return 'http'
  }

  /**
   * Origin of the URL
   */
  public get origin (): string {
    return `${this.protocol}://${this.host || ''}`
  }

  /**
   * Remote IP address
   * 
   * @type {String | undefined}
   */
  public get ip (): string | undefined {
    return this.stream.socket.remoteAddress
  }

  /**
   * Returns the request header value
   * 
   * Case insensitive name matching.
   * 
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type')
   *     // => "text/plain"
   *
   *     this.get('content-type')
   *     // => "text/plain"
   *
   *     this.get('Something')
   *     // => undefined
   * 
   * @param {String} header
   * @returns {String | Array<String> | undefined}
   */
  public get (header: string): string | string[] | undefined {
    switch (header = header.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer

      default:
        return this.headers[header]
    }
  }

  /**
   * Check if the header is present
   * 
   * Case insensitive name matching.
   * 
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   * 
   * Examples:
   * 
   *     this.has('Content-Type')
   *     // => true
   *
   *     this.has('content-type')
   *     // => true
   *
   *     this.has('Something')
   *     // => false
   * 
   * @param {String} header
   * @returns {Boolean}
   */
  public has (header: string): boolean {
    return this.get(header) !== undefined
  }

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * 
   * It returns the first matching type or false otherwise
   * 
   * Examples:
   * 
   *     // With Content-Type: text/html charset=utf-8
   *     this.is('html') // => 'html'
   *     this.is('text/html') // => 'text/html'
   *     this.is('text/*', 'application/json') // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded') // => 'json'
   *     this.is('application/json') // => 'application/json'
   *     this.is('html', 'application/*') // => 'application/json'
   *
   *     this.is('html') // => false
   * 
   * @param {String...} types
   * @returns {String | false}
   */
  public is (...types: string[]): string | false {
    return ct.is(this.type, types)
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `false`, in which
   * case you should respond with 406 "Not Acceptable".
   * 
   * It returns an array of accepted mime types
   * ordered by "qvalue" parameter, if no argument given
   * 
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   * 
   * Examples:
   * 
   *     // with Accept: text/html
   *     this.accept('html')
   *     // => "html"
   *
   *     // with Accept: text/*, application/json
   *     this.accept('html')
   *     // => "html"
   *     this.accept('text/html')
   *     // => "text/html"
   *     this.accept('json', 'text')
   *     // => "json"
   *     this.accept('application/json')
   *     // => "application/json"
   *
   *     // with Accept: text/*, application/json
   *     this.accept('image/png')
   *     this.accept('png')
   *     // => false
   *
   *     // with Accept: text/*q=.5, application/json
   *     this.accept('html', 'json')
   *     // => "json"
   *
   *     // with Accept: text/*, application/json
   *     this.accept()
   *     // => ["text/*", "application/json"]
   * 
   * @param {String...} types
   * @returns {String | Array<String> | false}
   */
  public accept (...types: string[]): string | false | string[] {
    return negotiator.accept(this.stream, types)
  }

  /**
   * Return accepted charsets or best fit based on `charsets`.
   * 
   * If no argument supplied, it returns all accepted charsets sorted by "qvalue"
   * 
   * Examples:
   * 
   *     // with Accept-Charset: utf-8, iso-8859-1q=0.2, utf-7q=0.5
   *     this.acceptCharset()
   *     // => ['utf-8', 'utf-7', 'iso-8859-1']
   *     this.acceptCharset('utf-8', 'iso-8859-1')
   *     // => "utf-8"
   *     this.acceptCharset('utf-16')
   *     // => false
   * 
   * @param {String...} args
   * @returns {String | Array<String> | false}
   */
  public acceptCharset (...args: string[]): string | false | string[] {
    return negotiator.acceptCharset(this.stream, args)
  }

  /**
   * Returns accepted encodings or best fit based on `encodings`.
   * 
   * If no argument supplied, it returns all accepted encodings sorted by "qvalue"
   * 
   * Examples:
   * 
   *     // with Accept-Encoding: gzip, deflate
   *     this.acceptEncoding()
   *     // => ['gzip', 'deflate']
   *     this.acceptEncoding('br', 'gzip')
   *     // => "gzip"
   *     this.acceptEncoding('br')
   *     // => false
   * 
   * @param {String...} args
   * @returns {String | Array<String> | false}
   */
  public acceptEncoding (...args: string[]): string | false | string[] {
    return negotiator.acceptEncoding(this.stream, args)
  }

  /**
   * Return accepted languages or best fit based on `langs`.
   * 
   * If no argument supplied, it returns all accepted languages sorted by "qvalue"
   * 
   * Examples:
   * 
   *     // with Accept-Language: enq=0.8, es, pt
   *     this.acceptLanguage()
   *     // => ['es', 'pt', 'en']
   *     this.acceptLanguage('en', 'pt')
   *     // => "en"
   *     this.acceptLanguage('fr')
   *     // => false
   * 
   * @param {String...} args
   * @returns {String | Array<String> | false}
   */
  public acceptLanguage (...args: string[]): string | false | string[] {
    return negotiator.acceptLanguage(this.stream, args)
  }
}
