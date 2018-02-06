'use strict'
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ip = require('ip')
const PORT = 3000
const serverIP = `${ip.address()}:${PORT}`
const Request = require('request-promise')

// Pi stuffs
const five = require('johnny-five')
const Raspi = require('raspi-io')
const SerialPort = require('serialport')
// currently not using IO, only serialport
// const board = new five.Board({
//   io: new Raspi()
// })

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(morgan('tiny'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
  next()
})

io.on('connection', client => {
  console.log('New client connected.')
  console.log('Total clients: ', io.engine.clientsCount)

  client.on('disconnect', () => {
    console.log('client left.')
  })
})

// Barcode Scanner
// Use carriage return for terminator
const scanner = new SerialPort( '/dev/ttyACM0')

scanner.on('open', () => {
  console.log('Barcode scanner active.')
  io.sockets.emit('scanner-detected', 'Barcode scanner active.')
})

scanner.on('data', data => {
  let barcode = data.toString().trim()

  // emit to client for display
  console.log(barcode)
  io.sockets.emit('barcode-scanned', barcode)
})

scanner.on('close', () => {
  console.log('Barcode scanner unplugged.')
  io.sockets.emit('scanner-not-found', {port: '/dev/ttyACM0'})
})

server.listen(PORT, () => console.log(`API listening on ${serverIP}`))
