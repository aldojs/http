
const { createServer } = require('..')

// server
const server = createServer(() => "Hello world!")

// start
server.start(3000)
