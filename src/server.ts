
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import is from '@sindresorhus/is'
import { setImmediate } from 'timers'
import { Response } from './response'

export type RequestHandler = (request: Request) => any

export type EventListener = (...args: any[]) => any

export type Request = http.IncomingMessage

export class Server {
  /**
   * Initialize a `Server` instance
   * 
   * @param native The native HTTP(S) server
   */
  public constructor (public native: http.Server | https.Server) {
  }

  /**
   * Add a request handler
   * 
   * @public
   */
  public on (event: 'request', handler: RequestHandler): this;

  /**
   * Add a `listener` for the given `event`
   * 
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  public on (event: string, fn: EventListener): this;

  public on (event: string, handler: any) {
    if (event === 'request') handler = this._wrap(handler)

    this.native.on(event, _defer(handler))

    return this
  }

  /**
   * Start a server listening for requests
   * 
   * @public
   */
  public start (portOrOptions?: number | net.ListenOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // attach the error listener
      this.native.once('error', reject)

      // listening
      this.native.listen(portOrOptions, () => {
        // remove the unecessary error listener
        this.native.removeListener('error', reject)

        // resolve the promise
        resolve()
      })
    })
  }

  /**
   * Stops the server from accepting new requests
   * 
   * @public
   */
  public stop (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.native.close((e: any) => e ? reject(e) : resolve())
    })
  }

  /**
   * Wrap the request event listener
   * 
   * @param handler The request event listener
   * @private
   */
  private _wrap (handler: RequestHandler): (...args: any[]) => any {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      new Promise<any>((resolve) => resolve(handler(req))).catch((err) => {
        // normalize
        if (! (err instanceof Error)) {
          err = new Error(`Non-error thrown: "${is(err)}"`)
        }

        // delegate
        if (this.native.listenerCount('error')) {
          this.native.emit('error', err)
        }

        let status = err.status || err.statusCode
        let body = err.expose ? err.message : 'Internal Server Error'

        // support ENOENT
        if (err.code === 'ENOENT') status = 404

        return new Response(body)
          .status(_isValid(status) ? status : 500)
          .type('text/plain; charset=utf-8')
          .set(err.headers || {})
      })
      .then((response) => {
        if (! (response instanceof Response)) {
          response = new Response(response)
        }

        response.send(res)
      })
    }
  }
}

/**
 * Defer the function invocation to the next tick
 * 
 * @param fn The event listener
 * @private
 */
function _defer (fn: EventListener) {
  return (...args: any[]) => setImmediate(fn, ...args)
}

/**
 * Check if the status code is a valid number
 * 
 * @param status
 * @private
 */
function _isValid (status: any): status is number {
  return typeof status === 'number' && status >= 100 && status <= 999
}
