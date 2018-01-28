
import { Server } from 'http'
import HttpRequest from './request'
import HttpResponse from './response'
import { setImmediate } from 'timers'
import { IncomingMessage, ServerResponse } from 'http'

type Listener = (...args: any[]) => void

const EVENTS = ['request']

export const Request = HttpRequest

export const Response = HttpResponse

export type RequestListener = (req: IncomingMessage, res: ServerResponse) => void

export function createServer (fn?: RequestListener): Server {
  var server = _decorate(new Server())

  // attach request event listener if available
  fn && server.on('request', fn)

  return server
}

/**
 * Decorate native server implementation
 * 
 * @param {Server} server
 * @returns {Server}
 * @private
 */
function _decorate (server: Server): Server {
  var oldOn = server.on

  server.on = function on (event: string, fn: Listener): Server {
    if (EVENTS.includes(event)) {
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
 * @returns {RequestListener}
 * @private
 */
function _wrap (fn: Listener): RequestListener {
  return (req: IncomingMessage, res: ServerResponse) => {
    setImmediate(fn, new Request(req, res), new Response(req, res))
  }
}
