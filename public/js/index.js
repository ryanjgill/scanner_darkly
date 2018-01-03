new Vue({
	el: '#main',
	template: `
	<div>
		<div class="currentBarcode">{{currentBarcode}}</div>
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
		scannedBarcodes: []
	},
	computed: {
    scannedBarcodesReversed() {
      return this.scannedBarcodes.reverse()
    }
	},
	created() {
    this.socket = io();

    this.socket.on('barcode-scanned', this.barcodeScanned)
  },
  methods: {
    barcodeScanned(data) {
      this.currentBarcode = data
      this.scannedBarcodes.push(data)
    },
    clearBarcodes() {
      this.currentBarcode = "Awaiting Scan..."
      this.scannedBarcodes = []
    }
  }
});
