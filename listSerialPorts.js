var fs = require("fs")
var dirs = fs.readdirSync( '/dev' );

for( var d = 0; d < dirs.length; d++ ) {
  console.log(dirs[d]);
  
  if( dirs[d] == 'ttyACM0' ) {
    console.log( 'Found barcode scanner.' );
    break;
  }
}
