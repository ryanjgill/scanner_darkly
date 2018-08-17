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
const chalk = require('chalk')
const publicIp = require('public-ip')
const iplocation = require('iplocation')
const macaddress = require('macaddress')
const isBarcodeForUser = require('./utils/isBarcodeForUser')

let LOCATION_INFO = {}
let CURRENT_USER
let hostname = 'ryans-mac-pro.lan'
let baseURL = `${hostname}:3000/inventory`

// Pi stuffs
const SCANNER = 'Cyclops'
const five = require('johnny-five')
const Raspi = require('raspi-io')
const SerialPort = require('serialport')
// currently not using IO, only serialport
const board = new five.Board({
  io: new Raspi(),
  repl: false
})



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

publicIp
  .v4()
  .then(iplocation)
  .then(res => {
    // get mac adress
    macaddress.one((err, mac) => {
      if (err) { console.error(err)}

      LOCATION_INFO = Object.assign({}, res, {mac})
    })   
  })
  .catch(err => console.error(err))

board.on('ready', () => {
  let blueLed = new five.Led("P1-11")
  let redLed = new five.Led("P1-13")
  let greenLed = new five.Led("P1-15")

  blueLed.off()
  redLed.off()
  greenLed.off()
  
  console.log(chalk.green("johnny-five ready!"))
  console.log(chalk.blue('Scanner: ', SCANNER))

  // Barcode Scanner
  // Use carriage return for terminator
  const scanner = new SerialPort( '/dev/ttyACM0')

  scanner.on('open', () => {
    blueLed.stop()
    blueLed.blink()
    console.log('Barcode scanner active.')
    io.sockets.emit('scanner-detected', 'Barcode scanner active.')
  })

  scanner.on('data', data => {
    let barcode = data.toString().trim()

    // check if barcode is a user 
    let userId = isBarcodeForUser(barcode)
    // set current user
    if (userId) {
      CURRENT_USER = userId
      // blink blue led?
      blueLed.stop()
      blueLed.blink()
      setTimeout(() => {
        blueLed.stop()
        blueLed.on()
      }, 2000)
      console.log(chalk.blue(`New User: ${userId}`))
    }

    let payload = {
      barcode,
      forUserId: CURRENT_USER,
      scanner: SCANNER,
      locationInfo: LOCATION_INFO
    }

    Request({
      method: 'POST',
      uri: `http://${baseURL}`,
      body: payload,
      json: true
    })
      .then(function (parsedBody) {
        // flash green led
        redLed.off()
        greenLed.blink(500)
        setTimeout(() => {
          greenLed.stop()
          greenLed.off()
        }, 2000)
        console.log(chalk.green('Scan saved.'))
      })
      .catch(function (err) {
        // flash red led
        greenLed.off()
        redLed.blink(500)
        setTimeout(() => {
          redLed.stop()
          redLed.off()
        }, 2000)
        console.log(chalk.red('Failed to save.'))
      })

    // emit to client for display
    console.log(barcode)
    io.sockets.emit('barcode-scanned', barcode)
  })

  scanner.on('close', () => {
    console.log(chalk.yellow('Barcode scanner unplugged.'))
    io.sockets.emit('scanner-not-found', {port: '/dev/ttyACM0'})
  })
})



server.listen(PORT, () => console.log(chalk.green(`API listening on ${serverIP}`)))