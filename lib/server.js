
'use strict'

const { EventEmitter } = require('events')
const { setImmediate } = require('timers')


exports.Server = class {
  /**
   * 
   * @param {EventEmitter} emitter 
   */
  constructor (emitter) {
    this._emitter = emitter
  }

  /**
   * Add na event listener.
   * 
   * @param {string | symbol} event The event name
   * @param {Function} fn The event listener
   * @public
   */
  on (event, fn) {
    let handler = _defer((event == 'request') ? _wrap(fn, this._emitter) : fn)

    // a hack to make the listener removable
    handler.listener = fn

    this._emitter.on(event, handler)

    return this
  }

  /**
   * Add a one time event listener
   * 
   * @param {string | symbol} event The event name
   * @param {Function} fn The event listener
   * @public
   */
  once (event, fn) {
    let handler = _defer(fn)

    // a hack to make the listener removable
    handler.listener = fn

    this._emitter.once(event, handler)

    return this
  }

  /**
   * Turn off an event listener or all listeners
   * 
   * @param {string | symbol} [event] The event name
   * @param {Function} [fn] The event listener
   * @public
   */
  off (event, fn) {
    if (!fn) this._emitter.removeAllListeners(event)
    else this._emitter.removeListener(event, fn)

    return this
  }

  /**
   * Emit an event with arguments
   * 
   * @param {string | symbol} event 
   * @param  {...any} args 
   * @returns {boolean}
   * @public
   */
  emit (event, ...args) {
    return this._emitter.emit(event, ...args)
  }

  /**
   * Start listening for requests
   * 
   * @param {number | object} portOrOptions 
   * @public
   * @async
   */
  start (portOrOptions) {
    let server = this._emitter

    // attach a default error handler
    if (! server.listenerCount('error')) {
      this.on('error', _onError)
    }

    return new Promise((resolve, reject) => {
      this.once('error', reject)

      server.listen(portOrOptions, () => {
        // remove the unecessary listener
        this.off('error', reject)

        resolve()
      })
    })
  }

  /**
   * Close the internal server
   * 
   * @public
   * @async
   */
  stop () {
    let server = this._emitter

    return new Promise((resolve, reject) => {
      server.close((err) => err ? reject(err) : resolve())
    })
  }
}

/**
 * Defer the function invocation to the next tick
 * 
 * @param {Function} fn The event listener
 * @private
 */
function _defer (fn) {
  return (...args) => setImmediate(fn, ...args)
}

/**
 * Wrap the request handler
 * 
 * @param {Function} handler The request handler
 * @param {EventEmitter} emitter 
 * @private
 */
function _wrap (handler, emitter) {
  return async (req, res) => {
    try {
      let response = await handler(req)

      await response.send(res)
    } catch (err) {
      // normalize
      if (! (err instanceof Error)) {
        err = new Error(`Non-error thrown: "${typeof err}"`)
      }

      // support ENOENT
      if (err.code === 'ENOENT') {
        err.expose = true
        err.status = 404
      }

      // send
      res.statusCode = err.status || err.statusCode || 500
      res.end()

      // delegate
      emitter.emit('error', err)
    }
  }
}

/**
 * The default `error` handler
 * 
 * @param {Error} err The error object
 * @private
 */
function _onError (err) {
  if (err.status === 404 || err.statusCode === 404 || err.expose) return

  let msg = err.stack || err.toString()

  console.error(`\n${msg.replace(/^/gm, '   ')}\n`)
}
