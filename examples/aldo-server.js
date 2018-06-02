
const { createServer } = require('aldo-http')

// server
const server = createServer(() => "Hello world!")

// start
server.start(3000)
