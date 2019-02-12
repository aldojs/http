
const http = require('http')
const sinon = require('sinon')
const { Server } = require('../lib')
const { EventEmitter } = require('events')


exports.createHttpServerStub = function createHttpServerStub () {
  return sinon.createStubInstance(http.Server)
}

exports.createFakeServer = function createFakeServer () {
  return new Server(new EventEmitter())
}

exports.noop = function noop () {
  // do nothing
}
