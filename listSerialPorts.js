const five = require("johnny-five")
const Tessel = require("tessel-io")
const fs = require("fs")
const SerialPort = require("serialport")
const board = new five.Board({
  io: new Tessel()
})

// Tessel USB ports
// ttyS0
// ttyS1

// list serial ports:
// SerialPort.list((err, ports) => {
//   ports.forEach(port => console.log(port.comName))
// })

var dirs = fs.readdirSync( '/dev' );

for( var d = 0; d < dirs.length; d++ ) {
  console.log(dirs[d]);
  
  if( dirs[d] == 'ttyACM0' ) {
    console.log( 'Found barcode scanner.' );
    break;
  }
}
