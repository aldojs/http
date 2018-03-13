
const SEPARATOR_RE = /\s*,\s*/

/**
 * Parse `X-Forwarded-*` headers
 * 
 * @param req Incoming message
 * @param field Header name
 */
export function parse (req: any, field: string): string[] {
  var value = req.headers[field] || ''

  // parse
  if (typeof value === 'string') {
    value = req.headers[field] = value.split(SEPARATOR_RE)
  }

  return Array.isArray(value) ? value : []
}
