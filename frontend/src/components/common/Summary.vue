<template>
    <v-card>
        <p class="text-h6 font-weight-medium text-center"> Summary </p>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="12">
                            <p class="text-h6 font-weight-medium"> Humidity </p>
                        </v-col>
                        <v-col cols="12">
                            <p class="text-h6 font-weight-medium"> Water Level </p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="12">
                            <p class="text-h6 font-weight-medium"> 28°C </p>
                        </v-col>
                        <v-col cols="12">
                            <p class="text-h6 font-weight-medium"> 50% </p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
        plantData: Object
    },
    data () {
      return {
      }
    },
    mounted(){

    },
    // methods:{
    //     getAverageWaterLevel(data){
    //         // Calculate the sum of water_level values
    //         const sumWaterLevel = data.reduce((acc, item) => acc + item.water_level, 0);
    //         // Calculate the average
    //         const averageWaterLevel = sumWaterLevel / data.length; 
    //         return averageWaterLevel;  
    //     }
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