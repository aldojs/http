
const { Request, Response } = require('../..')

exports.createRequest = (req = { headers: {} }, res) => {
  return new Request(req, outgoingMessage(res))
}

exports.createResponse = (req = { headers: {} }, res) => {
  return new Response(req, outgoingMessage(res))
}

function outgoingMessage (res) {
  return Object.assign({
    headers: {},

    getHeader (name) {
      return this.headers[name.toLowerCase()]
    },

    setHeader (name, value) {
      this.headers[name.toLowerCase()] = value
    },

    removeHeader (name) {
      delete this.headers[name.toLowerCase()]
    },

    hasHeader (name) {
      return name.toLowerCase() in this.headers
    },

    getHeaders () {
      return this.headers
    },

    getHeaderNames () {
      return Object.keys(this.headers)
    }
  }, res)
}
