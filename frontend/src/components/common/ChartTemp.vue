<template>
  <div class="row chartElem">
    <highcharts class="chart" :options="chartData" :updateArgs="updateArgs"></highcharts>
  </div>
</template>

<script>
export default {
  props: {
    plantData: Object
  },
  data() {
    return {
      updateArgs: [true, true, { duration: 1000 }],
      chartData: {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Humidity'
        },
        xAxis: {
          categories: [],
          title: {
            text: 'Timestamp'
          },
        },
        yAxis: {
            title: {
              text: 'Humidity'
            },
          },
        series: [{
          name: 'Humidity Level',
          data: [],
          color: '#6fcd98',
        }]
      }
    }
  },
  mounted(){
    if(this.plantData)[
      this.formatData(this.plantData)
    ]
  },
  methods: {
    formatData(plantData) {
      console.log(plantData);
      for (var data of plantData) {
        console.log(data.timestamp);
        console.log(data.humidity_level)
        // categories.push(data.timestamp)
        this.chartData.xAxis.categories.push(new Date(data.timestamp).toISOString())
        this.chartData.series[0].data.push(data.humidity_level)
      }
      // console.log(this.chartData.xAxis.categories)
      // for (timestamp of this.chartData.xAxis.categories) {
      //   timestamp = timestamp.slice(0, 10) + " " + timestamp.slice(11, 19)
      // }
      // console.log(this.chartData.xAxis.categories)
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