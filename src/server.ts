
import Request from './request'
import Response from './response'
import { setImmediate } from 'timers'
import { IncomingMessage, ServerResponse, Server } from 'http'

type Listener = (...args: any[]) => void

export type RequestListener = (req: Request, res: Response) => void

/**
 * Create a decorated version of the native HTTP server
 * 
 * @param {RequestListener} fn
 * @returns {Server}
 */
export default function createServer (fn?: RequestListener): Server {
  var server = _decorate(new Server())

  // attach request event listener
  fn && server.on('request', fn)

  return server
}

/**
 * Decorate native server instance
 * 
 * @param {Server} server
 * @returns {Server}
 * @private
 */
function _decorate (server: Server): Server {
  var oldOn = server.on

  server.on = function on (event: string, fn: Listener): Server {
    if (event === 'request') {
      fn = _wrap(fn)
    }

    oldOn.call(this, event, fn)
    return this
  }

  return server
}

/**
 * Wrap the event listener
 * 
 * @param {Listener} fn
 * @returns {Listener}
 * @private
 */
function _wrap (fn: Listener): Listener {
  return (req: IncomingMessage, res: ServerResponse) => {
    setImmediate(fn, new Request(req), new Response(res))
  }
}
