new Vue({
	el: '#main',
	template: `
  <div>
    <div v-if="noScannerMessage" class="noScannerMessage">{{noScannerMessage}}</div>
		<div v-else class="currentBarcode">{{currentBarcode}}</div>
    <div>
      <pre v-if="jsonPayload">{{jsonPayload}}</pre>
		</div>
	</div>
	`,
	data: {
    currentBarcode: 'Awaiting Scan',
    jsonPayload: ''
	},
	computed: {
	},
	created() {
    this.socket = io();

    this.socket.on('barcode-scanned', this.barcodeScanned)
    this.socket.on('scanner-not-found', this.scannerNotFound)
  },
  methods: {
    barcodeScanned(data) {
      var self = this;
      // this.currentBarcode = data
      // this.scannedBarcodes.push(data)

      // Request from localhost with id
      let collinIp = '128.157.15.207'
      axios.get(`http://localhost:3000/api/component/${data}`)
        .then(function (response) {
          console.log(response);
          self.jsonPayload = JSON.stringify(response.data, null, 2)
          self.currentBarcode = data
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    scannerNotFound(data) {
      this.noScannerMessage = "Scanner not found."
      console.log(`Scanner missing on port: ${data.port}`)
    }
  }
});
