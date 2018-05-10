
const { createServer } = require('http')

// server
const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain')
  response.setHeader('Content-Length', 12)
  response.end('Hello world!')
})

// start
server.listen(3000)
