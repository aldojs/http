
const { createServer } = require('http')

// server
const server = createServer()

// handler
server.on('request', (req, res) => {
  let body = 'Hello world!'

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
})

// start
server.listen(3000)
