
import * as http from 'http'
import * as url from './support/url'
import * as cookie from './support/cookie'
import * as qs from './support/query-string'
import * as ct from './support/content-type'
import * as charset from './support/charset'
import * as negotiator from './support/negotiator'

export default class Request {
  body: any = null

  constructor (public stream: http.IncomingMessage) {
    // 
  }

  get headers (): http.IncomingHttpHeaders {
    return this.stream.headers
  }

  get cookies (): { [x: string]: string | undefined } {
    return cookie.parse(this.stream)
  }

  get url (): string {
    return url.parse(this.stream).pathname || '/'
  }

  get method (): string {
    return this.stream.method || 'GET'
  }

  get querystring (): string {
    return url.parse(this.stream).query as string || ''
  }

  get type (): string | undefined {
    return ct.extract(this.headers['content-type'] as string)
  }

  get charset (): string | undefined {
    return charset.extract(this.headers['content-type'] as string)
  }

  get length (): number {
    var len = this.headers['content-length'] as string

    return len ? Number(len) : NaN
  }

  get query (): { [key: string]: string | string[] | undefined } {
    return qs.parse(this.stream)
  }

  get secure (): boolean {
    return (this.stream.socket as any).encrypted
  }

  get host (): string | undefined {
    return this.headers.host as string
  }

  get protocol (): string {
    return this.secure ? 'https' : 'http'
  }

  get origin (): string {
    return `${this.protocol}://${this.host || ''}`
  }

  get ip (): string | undefined {
    return this.stream.socket.remoteAddress
  }

  get (header: string): string | string[] | undefined {
    switch (header = header.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer

      default:
        return this.headers[header]
    }
  }

  has (header: string): boolean {
    return header.toLowerCase() in this.headers
  }

  is (...types: string[]): string | false {
    return ct.is(this.type, types)
  }

  accept (...types: string[]): string | false | string[] {
    return negotiator.accept(this.stream, types)
  }

  acceptCharset (...args: string[]): string | false | string[] {
    return negotiator.acceptCharset(this.stream, args)
  }

  acceptEncoding (...args: string[]): string | false | string[] {
    return negotiator.acceptEncoding(this.stream, args)
  }

  acceptLanguage (...args: string[]): string | false | string[] {
    return negotiator.acceptLanguage(this.stream, args)
  }
}
