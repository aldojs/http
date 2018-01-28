
import * as url from './url'
import * as qs from 'querystring'

const SYMBOL = Symbol('REQUEST#QUERY')

export function parse (req: any): { [x: string]: any } {
  var str = <string> url.parse(req).query || ''

  return req[SYMBOL] || (req[SYMBOL] = (str ? qs.parse(str) : {}))
}
