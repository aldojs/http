
'use strict'

const http = require('http')
const https = require('https')
const { Server } = require('./server')


exports.Server = Server

/**
 * Create a new server instance
 * 
 * @param {Object} [options] 
 * @param {Function} [fn] 
 */
exports.createServer = function (options = {}, fn) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  let server = new Server(_createNativeServer(options.tls))

  if (fn) server.on('request', fn)

  return server
}

/**
 * Create native server
 * 
 * @param {Object} tlsOptions 
 * @private
 */
function _createNativeServer (tlsOptions) {
  return tlsOptions ? https.createServer(tlsOptions) : http.createServer()
}
