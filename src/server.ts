
import * as http from 'http'
import Request from './request'
import Response from './response'
import { setImmediate } from 'timers'

type Listener = (...args: any[]) => void

export default class Server extends http.Server {
  on (event: string, listener: Listener): this {
    return this.addListener(event, listener)
  }

  addListener (event: string, listener: Listener): this {
    return super.addListener(event, _wrap(event, listener))
  }
}

/**
 * Wrap the event listener
 * 
 * @param {Function} fn
 * @returns {Function}
 * @private
 */
function _wrap (event: string, fn: Listener): Listener {
  if (event !== 'request') return fn

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    setImmediate(fn, new Request(req), new Response(res))
  }
}
