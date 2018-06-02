
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import is from '@sindresorhus/is'
import { createResponse, createErrorResponse } from './response'

export type RequestHandler = (req: IRequest) => any

export type EventListener = (...args: any[]) => any

export interface IRequest extends http.IncomingMessage {
  // 
}

/**
 * High level server for request handling
 */
export class Server {
  /**
   * The internal server
   * 
   * @protected
   */
  protected _server: http.Server | https.Server

  /**
   * Create a new server instance
   * 
   * @param server The HTTP(S) native server
   * @constructor
   * @public
   */
  public constructor (server: http.Server | https.Server) {
    this._server = server
  }

  /**
   * Add a handler for the `request` event
   * 
   * @param event The `request` event
   * @param handler The `request` handler
   * @public
   */
  public on (event: 'request', handler: RequestHandler): this

  /**
   * Add a `listener` for the given `event`
   * 
   * @param event The event name
   * @param listener The event listener
   * @public
   */
  public on (event: string, listener: EventListener): this

  public on (event: string, fn: EventListener) {
    if (event === 'request') fn = this._wrap(fn)

    // attach the listener
    this._server.on(event, _defer(fn))

    return this
  }

  /**
   * Add a one time `listener` for the given `event`
   * 
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  public once (event: string, fn: EventListener): this {
    this._server.once(event, _defer(fn))
    return this
  }

  /**
   * Trigger the `event` with `args`
   * 
   * @param event The event name
   * @param args The optional arguments to pass
   * @public
   */
  public emit (event: string, ...args: any[]): boolean {
    return this._server.emit(event, ...args)
  }

  /**
   * Stop listening to the given `event`
   * 
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  public off (event?: string, fn?: EventListener): this {
    if (event == null || fn == null) {
      this._server.removeAllListeners(event)
    } else {
      this._server.removeListener(event, fn)
    }

    return this
  }

  /**
   * Start a server listening for requests
   * 
   * @public
   */
  public start (portOrOptions?: number | net.ListenOptions): Promise<void> {
    // attach a default error handler
    if (!this._server.listenerCount('error')) this.on('error', _onError)

    return new Promise<void>((resolve, reject) => {
      // attach the error listener
      this._server.once('error', reject)

      // listening
      this._server.listen(portOrOptions, () => {
        // remove the unecessary error listener
        this._server.removeListener('error', reject)

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
      this._server.close((e: any) => e ? reject(e) : resolve())
    })
  }

  /**
   * Wrap the request handler
   * 
   * @param handler The request handler
   * @protected
   */
  protected _wrap (handler: EventListener): EventListener {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
      try {
        let output = await handler(req)

        let response = createResponse(output)

        await response.send(res)
      } catch (err) {
        // normalize
        if (! (err instanceof Error)) {
          err = new Error(`Non-error thrown: "${is(err)}"`)
        }

        // support ENOENT
        if (err.code === 'ENOENT') {
          err.expose = true
          err.status = 404
        }

        // send
        createErrorResponse(err).send(res)

        // delegate
        this.emit('error', err)
      }
    }
  }
}

/**
 * The default `error` event listener
 * 
 * @param err The error object
 * @private
 */
function _onError (err: any): void {
  if (err.status === 404 || err.expose) return

  let msg: string = err.stack || err.toString()

  console.error()
  console.error(msg.replace(/^/gm, '   '))
  console.error()
}

/**
 * Defer the function invocation to the next tick
 * 
 * @param fn The event listener
 * @private
 */
function _defer (fn: EventListener): EventListener {
  return (...args: any[]) => setImmediate(fn, ...args)
}
