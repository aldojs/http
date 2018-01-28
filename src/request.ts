
import * as http from 'http'
import * as typeis from 'type-is'
import * as mime from 'mime-types'
import * as url from './support/url'
import * as cookie from './support/cookie'
import * as qs from './support/query-string'
import * as negotiator from './support/negotiator'

export default class Request {
  body: any = null

  constructor (public req: http.IncomingMessage, public res: http.ServerResponse) {
    // 
  }

  get headers (): http.IncomingHttpHeaders {
    return this.req.headers
  }

  get cookies (): { [x: string]: string | undefined } {
    return cookie.parse(this.req)
  }

  get url (): string {
    return url.parse(this.req).pathname || '/'
  }

  get method (): string {
    return this.req.method || 'GET'
  }

  get querystring (): string {
    return <string> url.parse(this.req).query || ''
  }

  get type (): string {
    var ct = this.get('Content-Type') as string

    return ct ? ct.split(';')[0].trim() : ''
  }

  get charset (): string {
    return mime.charset(this.get('Content-Type') as string) || ''
  }

  get length (): number {
    var len = this.get('Content-Length') as string

    return len ? Number(len) : undefined as any
  }

  get query (): { [x: string]: any } {
    return qs.parse(this.req)
  }

  get secure (): boolean {
    return (this.req.socket as any).encrypted
  }

  get host (): string {
    return this.get('Host') as string
  }

  get protocol (): string {
    return this.secure ? 'https' : 'http'
  }

  get (header: string): string | string[] {
    switch (header = header.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer || ''

      default:
        return this.headers[header] || ''
    }
  }

  has (header: string): boolean {
    return (header.toLowerCase() in this.headers)
  }

  is (...types: string[]): string | false {
    return typeis.is(this.type, types)
  }

  accept (...types: string[]): string | false | string[] {
    return negotiator.accept(this.req, types)
  }

  acceptCharset (...args: string[]): string | false | string[] {
    return negotiator.acceptCharset(this.req, args)
  }

  acceptEncoding (...args: string[]): string | false | string[] {
    return negotiator.acceptEncoding(this.req, args)
  }

  acceptLanguage (...args: string[]): string | false | string[] {
    return negotiator.acceptLanguage(this.req, args)
  }
}
