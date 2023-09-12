<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="mx-auto w-100">
        <v-card class="w-100" color="light-blue">
          <v-card-title>High chart sample</v-card-title>
          <v-card-text>
            <highcharts class="w-100" :options="chartOptions"></highcharts>
          </v-card-text>
        </v-card>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>

import { Chart } from 'highcharts-vue'

export default {
  components: {
    highcharts: Chart
  },
  data() {
    return {
      chartOptions: {
        series: [
          {
            data: [1, 2, 3, 4, 5, 4, 7, 8],
          },
        ],
      }
    }
  }
}






</script>
