new Vue({
	el: '#main',
	template: `
  <div>
    <div v-if="noScannerMessage" class="noScannerMessage">{{noScannerMessage}}</div>
		<div v-else class="currentBarcode">{{currentBarcode}}</div>
    <div class="scannedBarcodes">
      <button
        v-if="scannedBarcodes && scannedBarcodes.length > 0"
        @click="clearBarcodes">
        Clear
      </button>
      <ul>
        <li v-for="barcode in scannedBarcodesReversed">{{barcode}}</li>
      </ul>
		</div>
	</div>
	`,
	data: {
    currentBarcode: 'Awaiting Scan',
    noScannerMessage: '',
		scannedBarcodes: []
	},
	computed: {
    scannedBarcodesReversed() {
      return this.scannedBarcodes.slice().reverse()
    }
	},
	created() {
    this.socket = io();

    this.socket.on('barcode-scanned', this.barcodeScanned)
    this.socket.on('scanner-not-found', this.scannerNotFound)
  },
  methods: {
    barcodeScanned(data) {
      this.currentBarcode = data
      this.scannedBarcodes.push(data)
    },
    clearBarcodes() {
      this.currentBarcode = "Awaiting Scan..."
      this.scannedBarcodes = []
    },
    scannerNotFound(data) {
      this.noScannerMessage = "Scanner not found."
      console.log(`Scanner missing on port: ${data.port}`)
    }
  }
});
