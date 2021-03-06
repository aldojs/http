
const assert = require('assert')
const { Server } = require('../lib')
const { createHttpServerStub } = require('./_support')


describe('server.start(argument)', () => {
  var stub
  var server

  beforeEach(() => {
    stub = createHttpServerStub()
    server = new Server(stub)
  })

  it('should return a promise', () => {
    var result = server.start(123)

    assert(result instanceof Promise)
  })

  describe('when `argument` is a port number', () => {
    it('should pass the port number to `listen` method', () => {
      server.start(123)

      assert(stub.listen.calledOnceWith(123))
    })
  })

  describe('when `argument` is a plain object', () => {
    it('should pass the options to `listen` method', () => {
      var options = { port: 123, host: 'localhost' }

      server.start(options)

      assert(stub.listen.calledWithMatch(options))
    })
  })
})
