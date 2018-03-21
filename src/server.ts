
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import Request from './request'
import Response from './response'
import { setImmediate } from 'timers'

export default class {
  private _options: { [x: string]: any }

  public native: http.Server | https.Server

  /**
   * Initialize a Server instance
   * 
   * @param server HTTP(S) server instance
   * @param options
   */
  public constructor (server: http.Server | https.Server, options = {}) {
    this._options = options
    this.native = server
  }

  /**
   * Add a `listener` for the given `event`
   * 
   * @param event
   * @param fn listener
   */
  public on (event: string, fn: (...args: any[]) => void): this {
    this.native.on(event, this._wrap(event, fn))
    return this
  }

  /**
   * Start a server listening for requests
   * 
   * @param options
   */
  public start (options: net.ListenOptions): Promise<void>
  /**
   * Start a server listening for requests
   * 
   * @param port
   */
  public start (port: number): Promise<void>
  public start (options: any) {
    return new Promise<void>((resolve, reject) => {
      // attach the error listener
      this.native.once('error', reject)

      // listening
      this.native.listen(options, () => {
        // remove the unecessary error listener
        this.native.removeListener('error', reject)

        // resolve the promise
        resolve()
      })
    })
  }

  /**
   * Stops the server from accepting new requests
   */
  public stop (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.native.close((err: any) => {
        err ? reject(err) : resolve()
      })
    })
  }

  /**
   * Wrap the `request` event listener
   * 
   * @param event
   * @param fn listener
   * @private
   */
  private _wrap (event: string, fn: (...args: any[]) => void): (...args: any[]) => void {
    var opts = this._options

    switch (event) {
      case 'request':
      case 'checkContinue':
      case 'checkExpectation':
        return (req: http.IncomingMessage, res: http.ServerResponse) => {
          setImmediate(fn, new Request(req, opts), new Response(res, opts))
        }
    }

    return () => { setImmediate(fn, ...arguments) }
  }
}
