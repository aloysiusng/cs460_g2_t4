<template>
  <v-card class="row chartElem">
    <v-card-title class="text-h5 font-weight-medium"><v-icon class="me-3">mdi-weather-partly-rainy</v-icon>Temperature and Humidity</v-card-title>
    <v-divider></v-divider>
    <highcharts class="chart" :options="chartData" :updateArgs="updateArgs"></highcharts>
  </v-card>
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
          type: 'area'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: [],
          title: {
            text: 'time_stamp'
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
      },
      options: {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
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
        console.log(data.time_stamp);
        console.log(data.humidity_level)
        // categories.push(data.time_stamp)
        this.chartData.xAxis.categories.push(new Date(data.time_stamp).toLocaleString("en-US", this.options))
        this.chartData.series[0].data.push(data.humidity_level)
      }
      // console.log(this.chartData.xAxis.categories)
      // for (time_stamp of this.chartData.xAxis.categories) {
      //   time_stamp = time_stamp.slice(0, 10) + " " + time_stamp.slice(11, 19)
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