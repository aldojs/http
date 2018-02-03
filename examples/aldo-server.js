
const { createServer } = require('../lib')

// server
const server = createServer()

// handler
server.on('request', (request, response) => {
  response.send('Hello world!')
})

// start
server.listen(3000)
