
import * as mime from 'mime-types'

type Accept = { value: string, weight: number }

const PARSE_RE = /^\s*([^\s;]+)\s*(?:;(.*))?$/

export function accept (req: any, preferences: string[]): string | false | string[] {
  var mediaTypes = _parse(req, 'accept', ['*/*'])

  // no types, return the first preferred type
  if (!preferences.length) return mediaTypes

  var mimes: any = preferences.reduce(_mimeReducer, {})

  for (let accept of mediaTypes)
    for (let type in mimes)
      if (_matchType(accept, type))
        return mimes[type]

  return false
}

export function acceptCharset (req: any, preferences: string[]): string | false | string[] {
  return _match(_parse(req, 'accept-charset'), preferences)
}

export function acceptEncoding (req: any, preferences: string[]): string | false | string[] {
  var encodings = _parse(req, 'accept-encoding', ['identity'])

  // https://tools.ietf.org/html/rfc7231#section-5.3.4
  if (!encodings.includes('identity')) {
    req.headers['accept-encoding'].push('identity')
  }

  return _match(encodings, preferences)
}

export function acceptLanguage (req: any, preferences: string[]): string | false | string[] {
  return _match(_parse(req, 'accept-language'), preferences)
}

// 
// Helpers
// 

/**
 * 
 * 
 * @param {Object} memo
 * @param {String} value
 * @returns {Object}
 * @private
 */
function _mimeReducer (memo: { [x: string]: string }, value: string) {
  memo[_normalize(value)] = value
  return memo
}

/**
 * Normalize the mime type
 * 
 * @param {String} type
 * @returns {String}
 * @private
 */
function _normalize (type: string): string {
  return type.includes('/') ? type : (mime.lookup(type) || '')
}

/**
 * 
 * 
 * @param {IncomingMessage} req
 * @param {String} header
 * @param {Array<String>} defaultValue
 * @returns {Array<String>}
 * @private
 */
function _parse (req: any, header: string, defaultValue = ['*']): string[] {
  if (typeof req.headers[header] === 'string') {
    req.headers[header] = _parseAccept(req.headers[header])
  }

  return req.headers[header] || (req.headers[header] = defaultValue)
}

/**
 * 
 * 
 * @param {Array<String>} memo
 * @param {String} value
 * @returns {Array<String>}
 * @private
 */
function _removeDuplicate (memo: string[], value: string): string[] {
  if (!memo.includes(value)) memo.push(value)
  
  return memo
}

/**
 * 
 * 
 * @param {Array<String>} accepted
 * @param {Array<String>} preferences
 * @returns {String | false | Array<String>}
 * @private
 */
function _match (accepted: string[], preferences: string[]): string | false | string[] {
  // no preferences, return all accepted
  if (!preferences.length) return accepted

  for (let accept of accepted)
    for (let value of preferences)
      if (_matchAccept(accept, value))
        return value

  return false
}

/**
 * 
 * 
 * @param {String} accepted
 * @param {String} type
 * @returns {Boolean}
 * @private
 */
function _matchType (accepted: string, type: string): boolean {
  type = type.toLowerCase()
  accepted = accepted.toLowerCase()

  if (accepted === type) return true

  for (let i = 0; i < Math.min(accepted.length, type.length); i++) {
    if (accepted[i] === '*') return true

    if (accepted[i] !== type[i]) break
  }

  return false
}

/**
 * Parse Accept-* header
 * 
 * @param {String} header
 * @returns {Array<String>}
 * @private
 */
function _parseAccept (header: string, defaultValue = ['*']): string[] {
  if (!header) return defaultValue

  return header
    .split(',')
    .map(_parsePart)
    .filter(_acceptable)
    .sort(_byWeight)
    .map(_toString)
    .reduce(_removeDuplicate, [])
}

/**
 * 
 * 
 * @param {Accept} obj
 * @returns {String}
 * @private
 */
function _toString (obj: Accept): string {
  return obj.value
}

/**
 * 
 * 
 * @param {Accept} a
 * @param {Accept} b
 * @returns {Number}
 * @private
 */
function _byWeight (a: Accept, b: Accept): number {
  return b.weight - a.weight
}

/**
 * 
 * 
 * @param {Accept} obj
 * @returns {boolean}
 * @private
 */
function _acceptable (obj: Accept): boolean {
  return obj.weight > 0
}

/**
 * Parse accept part
 * 
 * @param {String} part
 * @returns {Accept|null}
 * @private
 */
function _parsePart (part: string): Accept {
  var match = PARSE_RE.exec(part.toLowerCase())

  if (!match) return { value: '', weight: 0 }

  if (match[2]) {
    let params = match[2].split(';')

    for (let i = 0; i < params.length; i++) {
      let [key, val] = params[i].trim().split('=')

      // look for quality param
      if (key === 'q') {
        return {
          value: match[1],
          weight: parseFloat(val)
        }
      }
    }
  }

  return { value: match[1], weight: 1 }
}

/**
 * 
 * 
 * @param {String} accept
 * @param {String} preference
 * @returns {Boolean}
 * @private
 */
function _matchAccept (accept: string, preference: string): boolean {
  return accept === '*' || accept.toLowerCase() === preference.toLowerCase()
}
