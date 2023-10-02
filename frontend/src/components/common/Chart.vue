<template>
    <v-row>
        <v-col cols="8">
            <div class="row chartElem">
                <highcharts class="chart" :options="chartTemp" :updateArgs="updateArgs"></highcharts>
            </div>
            <div class="row">
                <highcharts class="chart" :options="chartWaterLevel" :updateArgs="updateArgs"></highcharts>
            </div>
            <!-- <div id="chartType">
            <select v-model="chartType">
                <option>Line</option>
                <option>Column</option>
            </select>
            </div> -->
        </v-col>
        <v-col cols="4">
            <v-card>
                Settings
            </v-card>
        </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    data () {
      return {
        updateArgs: [true, true, {duration: 1000}],
        chartTemp: {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Temperature'
          },
          series: [{
            data: [28, 29, 33, 36, 32, 32, 33, 30],
            color: '#6fcd98'
          }]
        },
        chartWaterLevel: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Water Level'
          },
          series: [{
            data: [120, 130, 110, 140, 132, 132, 133, 130],
            color: '#6fcd98'
          }]
        },
      }
    },
    // created () {
    //   let i = document.createElement('input')
    //   i.setAttribute('type', 'color');
    //   (i.type === 'color') ? this.colorInputIsSupported = true : this.colorInputIsSupported = false
    // },
    // watch: {
    //   title (newValue) {
    //     this.chartOptions.title.text = newValue
    //   },
    //   points: {
    //     handler(newValue) {
    //       this.chartOptions.series[0].data = newValue
    //     },
    //     deep: true
    //   },
    //   chartType (newValue) {
    //     this.chartOptions.chart.type = newValue.toLowerCase()
    //   },
    //   seriesColor (newValue) {
    //     this.chartOptions.series[0].color = newValue.toLowerCase()
    //   },
    //   animationDuration (newValue) {
    //     this.updateArgs[2].duration = Number(newValue)
    //   }
    // }
  }
  </script>
  
  <style scoped>
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  #colorPicker {
    border: 0;
    padding: 0;
    margin: 0;
    width: 30px;
    height: 30px;
  }
  .numberInput {
    width: 30px;
  }
  </style>