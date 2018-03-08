
import * as url from './url'
import * as qs from 'querystring'

export function parse (req: any): { [x: string]: any } {
  var urlObject = url.parse(req)
  var value = urlObject.query || {}

  // parse
  if (typeof value === 'string') {
    value = urlObject.query = qs.parse(value)
  }

  return value
}
