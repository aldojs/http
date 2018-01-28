
import { Url } from 'url'
import * as parseUrl from 'parseurl'
import { IncomingMessage } from 'http'

export function parse (req: IncomingMessage): Url {
  return parseUrl(req) || {}
}
