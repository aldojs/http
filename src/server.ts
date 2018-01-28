
import { Server } from 'http'
import { setImmediate } from 'timers'

export type Listener = (...args: any[]) => void

export default class extends Server {
  on (event: string, fn: Listener) {
    super.on(event, _wrap(fn))
    return this
  }
}

/**
 * Wrap the event listener
 * 
 * @param {Listener} fn
 * @returns {Listener}
 * @private
 */
function _wrap (fn: Listener): Listener {
  return (...args: any[]) => {
    setImmediate(fn, ...args)
  }
}
