
const { createServer } = require('http')

// server
const server = createServer((request, response) => {
  response.end('Hello world!')
})

// start
server.listen(3000)
