
const { createServer } = require('..')

// server
const server = createServer(() => {
  return {
    statusCode: 200, // mandatory
    body: "Hello world!"
  }
})

// start
server.start(3000)
