
const { createServer } = require('http')

// server
const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain')
  response.end('Hello world!')
})

// start
server.listen(3000)
