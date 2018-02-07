
const { createServer } = require('http')

// server
const server = createServer()

// handler
server.on('request', (request, response) => {
  let body = 'Hello world!'

  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Content-Length', Buffer.byteLength(body))
  response.end(body)
})

// start
server.listen(3000)
