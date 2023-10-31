<template>
    <v-card class="row chartElem">
      <v-card-title class="text-h5 font-weight-medium"><v-icon class="me-3">mdi-water</v-icon>Water Level<v-spacer></v-spacer></v-card-title>
      <v-divider></v-divider>
        <highcharts class="chart" :options="chartData" :updateArgs="updateArgs"></highcharts>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      plantData: Object
    },
    data () {
      return {
        updateArgs: [true, true, {duration: 1000}],
        chartData: {
          chart: {
            type: 'area'
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: [],
            title: {
              text: 'Time'
            },
          },
          yAxis: {
            title: {
              text: 'Water Level'
            },
          },
          series: [{
            name: 'Water Level',
            data: [],
            color: '#6fcd98'
          }]
        },
        options: {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        },
      }
    },
    mounted () {
      if(this.plantData){
        this.formatData(this.plantData)
      }
    },
    methods: {
      formatData(plantData) {
        for (var data of plantData) {
          // categories.push(data.time_stamp)
          this.chartData.xAxis.categories.push(new Date(data.time_stamp).toLocaleString("en-US", this.options))
          this.chartData.series[0].data.push(data.water_level)
        }
      }
    },
    watch: {
      plantData: {
        handler(newValue) {
          if(newValue){
            this.chartData.xAxis.categories = []
            this.chartData.series[0].data = []
            this.formatData(newValue)
          }
        },
        deep: true
        }
      }
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