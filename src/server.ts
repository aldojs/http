
import * as net from 'net'
import * as http from 'http'
import * as https from 'https'
import { setImmediate as defer } from 'timers'

export default class Server {
  /**
   * Initialize a Server instance
   * 
   * @param native The native HTTP(S) server
   */
  public constructor (public native: http.Server | https.Server) {
    // 
  }

  /**
   * Add a `listener` for the given `event`
   * 
   * @param event
   * @param fn listener
   */
  public on (event: string, fn: (...args: any[]) => any): this {
    this.native.on(event, (...args) => defer(fn, ...args))
    return this
  }

  /**
   * Start a server listening for requests
   */
  public start (portOrOptions: number | net.ListenOptions): Promise<void> {
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
   */
  public stop (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.native.close((err: any) => {
        err ? reject(err) : resolve()
      })
    })
  }
}
