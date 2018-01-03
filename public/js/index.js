new Vue({
	el: '#main',
	template: `
	<div>
		<div class="currentBarcode">{{currentBarcode}}</div>
    <div class="scannedBarcodes">
      <button @click="this.scannedBarcodes = []">Clear</button>
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
    updateChart() {
      let series = this.$refs.highcharts.chart.series
      let ticks = new Date().getTime()
			series[0].addPoint([ticks, +this.$data.room_temp], false, true)
			series[1].addPoint([ticks, +this.$data.case_temp], false, true)
			series[2].addPoint([ticks, +this.$data.radiator_temp], false, true)
			series[3].addPoint([ticks, +this.$data.gpu_1_temp], false, true)
			series[4].addPoint([ticks, +this.$data.gpu_2_temp], true, true)
    }
  }
});
