
const { createServer } = require('../lib')

// server
const server = createServer()

// handler
server.on('request', (req, res) => {
  res.send('Hello world!')
})

// start
server.listen(3000)
