
const { createServer } = require('..')

// server
const server = createServer((request, response) => {
  response.send('Hello world!')
})

// start
server.start(3000)
