
import { Response } from '../../src'

/**
 * 
 */
export function createResponse (body?: any): Response {
  return new Response(body)
}
