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
	data() {
    return {
      currentBarcode: 'Awaiting Scan',
      jsonPayload: '',
      noScannerMessage: null
    }
	},
	created() {
    this.socket = io();

    this.socket.on('barcode-scanned', this.barcodeScanned)
    this.socket.on('scanner-not-found', this.scannerNotFound)
  },
  methods: {
    barcodeScanned(data) {
      var self = this;
      this.currentBarcode = data
      this.scannedBarcodes.push(data)
    },
    scannerNotFound(data) {
      this.noScannerMessage = "Scanner not found."
      console.log(`Scanner missing on port: ${data.port}`)
    }
  }
});
