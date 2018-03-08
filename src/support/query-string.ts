
import * as url from './url'
import * as qs from 'querystring'

const SYMBOL = '@@REQUEST-QUERY'

export function parse (req: any): { [x: string]: any } {
  // parse
  if (!req[SYMBOL]) {
    let str = <string> url.parse(req).query || ''

    req[SYMBOL] = (str ? qs.parse(str) : {})
  }

  return req[SYMBOL]
}
