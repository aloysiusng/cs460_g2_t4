<template>
    <v-card>
        <v-card-title  class="text-h6 font-weight-medium text-start"><v-icon class="me-3">mdi-format-list-bulleted</v-icon>Summary </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-card color="info" variant="outlined">
                <v-card-title>Latest Data</v-card-title>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-thermometer</v-icon>
                        <p class="text-title font-weight-medium">Temperature</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Humidity</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-weather-pouring</v-icon>
                        <p class="text-title font-weight-medium">Raining</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">No</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-water</v-icon>
                        <p class="text-title font-weight-medium">Last watered</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
            </v-card>
            <v-card-item>
            </v-card-item>
        </v-card-text>
        
        <v-card-text>
            <v-card color="secondary" variant="outlined">
                <v-card-title>Daily Average</v-card-title>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-thermometer</v-icon>
                        <p class="text-title font-weight-medium">Temperature</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Humidity</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
            </v-card>
            <v-card-item>
            </v-card-item>
        </v-card-text>
    </v-card>
</template>
  
<script>
export default {
    props: {
        plantData: Object
    },
    data() {
        return {
        }
    },
    mounted() {

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