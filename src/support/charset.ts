
/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
const PARAM_REGEXP = / *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
const QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g

/**
 * Extract the charset from the content-type header
 * 
 * @param {String} header
 * @returns {String}
 * 
 * @see https://github.com/jshttp/content-type
 */
export function extract (header: string): string | undefined {
  if (!header) return

  var [, ...params] = header.split(';')

  // missing parameters
  if (!params.length) return

  for (let param of params) {
    let match = PARAM_REGEXP.exec(param)

    // invalid paramter
    if (!match) return
    
    if (match[1].toLowerCase() !== 'charset') continue

    // return only the value of the "charset"
    let value = match[2]

    if (!value.startsWith('"')) return value
      
    return value.substr(1, value.length - 2).replace(QESC_REGEXP, '$1')
  }
}
