<template>
    <v-card class="row chartElem">
      <v-card-title class="text-h5 font-weight-medium"><v-icon class="me-3">mdi-water</v-icon>Water Level</v-card-title>
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
              text: 'Timestamp'
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
        console.log(plantData);
        for (var data of plantData) {
          console.log(data.timestamp);
          console.log(data.water_level)
          // categories.push(data.timestamp)
          this.chartData.xAxis.categories.push(new Date(data.timestamp).toLocaleString("en-US", this.options))
          this.chartData.series[0].data.push(data.water_level)
        }
      }
    },
    watch: {
      plantData: {
        handler(newValue) {
          // Update the series data when the plantData prop changes
          this.chartTemp.series[0].data = this.formatData(newValue);
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