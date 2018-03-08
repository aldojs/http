
import * as http from 'http'
import * as url from './support/url'
import * as cookie from './support/cookie'
import * as qs from './support/query-string'
import * as ct from './support/content-type'
import * as charset from './support/charset'
import * as negotiator from './support/negotiator'

export default class Request {
  /**
   * Request body
   */
  public body: any = null

  /**
   * Trust proxy headers
   */
  private _trustProxy: boolean

  /**
   * Contruct a new request instance
   * 
   * @param stream
   * @param options
   */
  public constructor (public stream: http.IncomingMessage, options: { proxy?: boolean } = {}) {
    this._trustProxy = Boolean(options.proxy)
  }

  /**
   * Request headers
   */
  public get headers (): http.IncomingHttpHeaders {
    return this.stream.headers
  }

  /**
   * Get the parsed cookies object
   */
  public get cookies (): { [x: string]: string | undefined } {
    return cookie.parse(this.stream)
  }

  /**
   * URL pathname
   */
  public  get url (): string {
    return url.parse(this.stream).pathname || '/'
  }

  /**
   * Request method
   */
  public get method (): string {
    return this.stream.method || 'GET'
  }

  /**
   * URL query string
   */
  public get querystring (): string {
    return url.parse(this.stream).query as string || ''
  }

  /**
   * Request mime type, void of parameters such as "charset", or undefined
   */
  public get type (): string | undefined {
    return ct.extract(this.headers['content-type'] as string)
  }

  /**
   * Get the charset when present or undefined
   */
  public get charset (): string | undefined {
    return charset.extract(this.headers['content-type'] as string)
  }

  /**
   * Returns the parsed Content-Length when present or NaN
   */
  public get length (): number {
    var len = this.headers['content-length'] as string

    return len ? Number(len) : NaN
  }

  /**
   * Get the parsed query string
   */
  public get query (): { [key: string]: string | string[] | undefined } {
    return qs.parse(this.stream)
  }

  /**
   * Returns true when requested with TLS, false otherwise
   */
  public get secure (): boolean {
    return this.protocol === 'https'
  }

  /**
   * Parse the "Host" header field host,
   * and support X-Forwarded-Host when a proxy is enabled
   */
  public get host (): string | undefined {
    if (this._trustProxy) {
      let values = _parse(this.headers, 'x-forwarded-host')

      if (values[0]) return (values[0])
    }

    return this.headers.host
  }

  /**
   * Return the protocol string "http",
   * or "https" when requested with TLS.
   * 
   * When the proxy option is enabled,
   * the "X-Forwarded-Proto" header will be trusted
   */
  public get protocol (): string {
    if ((this.stream.socket as any).encrypted) return 'https'

    if (this._trustProxy) {
      let values = _parse(this.headers, 'x-forwarded-proto')

      if (values[0]) return values[0]
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
   * When proxy option is set to `true`, parse
   * the `X-Forwarded-For` header for IP address list.
   * 
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where `proxy2` is the furthest down-stream.
   */
  public get ips (): string[] {
    return this._trustProxy ? _parse(this.headers, 'x-forwarded-for') : []
  }

  /**
   * Remote IP address
   */
  public get ip (): string | undefined {
    return this.ips[0] || this.stream.socket.remoteAddress
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
   * @param header
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
   * @param header
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
   * @param types
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
   * @param types
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
   * @param args
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
   * @param args
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
   * @param args
   */
  public acceptLanguage (...args: string[]): string | false | string[] {
    return negotiator.acceptLanguage(this.stream, args)
  }
}

/**
 * Parse `X-Forwarded-*` headers
 * 
 * @private
 */
function _parse (headers: http.IncomingHttpHeaders, field: string): string[] {
  let value = headers[field] || ''

  // parse
  if (typeof value === 'string') {
    value = headers[field] = value.split(/\s*,\s*/)
  }

  return Array.isArray(value) ? value : []
}
