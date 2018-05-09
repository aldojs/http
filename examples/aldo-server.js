
const { createServer } = require('..')

// server
const server = createServer(() => {
  return {
    statusCode: 200, // mandatory
    body: "Hello world!",
    headers: {
      'Content-Type': 'text/plain'
    }
  }
})

// start
server.start(3000)
