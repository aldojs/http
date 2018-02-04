
import * as cookie from 'cookie'

export type ParseOptions = cookie.CookieParseOptions
export type SerializeOptions = cookie.CookieSerializeOptions

export function parse (req: any, options?: ParseOptions): { [x: string]: string | undefined } {
  if (typeof req.headers.cookie === 'string') {
    req.headers.cookie = cookie.parse(req.headers.cookie, options)
  }

  return req.headers.cookie || (req.headers.cookie = {})
}

export function serialize (name: string, value: string, options?: SerializeOptions): string {
  return cookie.serialize(name, String(value), options)
}
