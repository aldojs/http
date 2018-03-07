
import * as http from 'http'
import Request from './request'
import Response from './response'
import { setImmediate } from 'timers'

type Listener = (...args: any[]) => void

export default class Server extends http.Server {
  private _options: object

  public constructor (options = {}) {
    super()

    this._options = options
  }

  public on (event: string, listener: Listener): this {
    return this.addListener(event, listener)
  }

  public addListener (event: string, listener: Listener): this {
    return super.addListener(event, this._wrap(event, listener))
  }

  /**
   * Wrap the event listener
   * 
   * @param {String} event
   * @param {Function} fn
   * @returns {Function}
   * @private
   */
  private _wrap (event: string, fn: Listener): Listener {
    if (event !== 'request') return fn

    var opts = this._options

    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      setImmediate(fn, new Request(req, opts), new Response(res, opts))
    }
  }
}
