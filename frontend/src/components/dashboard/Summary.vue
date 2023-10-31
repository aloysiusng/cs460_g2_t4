<template>
    <v-card elevation="3">
        <v-card-title class="text-h6 font-weight-medium text-start">
            <v-icon class="me-3">mdi-format-list-bulleted</v-icon>Summary
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-card color="info" variant="outlined">
                <v-card-title>Latest Data</v-card-title>
                <v-card-item v-for="(dataItem, key) in latestData" :key="key">
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">{{ dataItem.icon }}</v-icon>
                        <p class="text-title font-weight-medium">{{ dataItem.label }}</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ dataItem.value }}</p>
                    </div>
                </v-card-item>
            </v-card>
            <v-card-item>
            </v-card-item>
        </v-card-text>

        <v-card-text class="pt-0">
            <v-card color="secondary" variant="outlined">
                <v-card-title>Daily Average</v-card-title>
                <v-card-item v-for="(average, key) in dailyAverage" :key="key">
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">{{ average.icon }}</v-icon>
                        <p class="text-title font-weight-medium">{{ average.label }}</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ average.value }}</p>
                    </div>
                </v-card-item>
            </v-card>
        </v-card-text>
    </v-card>
</template>
  
<script>
export default {
    props: {
        plantData: Array
    },
    computed: {
        latestData() {
            // Get the latest data from plantData
            if (Array.isArray(this.plantData) && this.plantData.length > 0) {
                const latest = this.plantData[this.plantData.length - 1];
                return [
                    {
                        icon: 'mdi-thermometer',
                        label: 'Temperature',
                        value: latest.temperature ? latest.temperature + '°C' : 'N/A',
                    },
                    {
                        icon: 'mdi-waves-arrow-up',
                        label: 'Humidity',
                        value: latest.humidity_level ? latest.humidity_level + '%' : 'N/A',
                    },
                    {
                        icon: 'mdi-weather-pouring',
                        label: 'Raining',
                        value: latest.raining ? 'Yes' : 'No',
                    },
                    {
                        icon: 'mdi-water',
                        label: 'Last watered',
                        value: latest.last_watered_timestamp ? latest.last_watered_timestamp : 'N/A',
                    },
                ];
            }
            return [];
        },
        dailyAverage() {
            // Calculate daily average from plantData
            if (Array.isArray(this.plantData) && this.plantData.length > 0) {
                // Filter out entries with non-null temperature and humidity
                const filteredData = this.plantData.filter(
                    (entry) => entry.temperature !== null && entry.humidity_level !== null
                );

                if (filteredData.length > 0) {
                    const sumTemperature = filteredData.reduce((acc, entry) => acc + entry.temperature, 0);
                    const averageTemperature = (sumTemperature / filteredData.length).toFixed(1);

                    const sumHumidity = filteredData.reduce((acc, entry) => acc + entry.humidity_level, 0);
                    const averageHumidity = (sumHumidity / filteredData.length).toFixed(1);

                    return [
                        {
                            icon: 'mdi-thermometer',
                            label: 'Temperature',
                            value: (averageTemperature/100 + 24) + '°C',
                        },
                        {
                            icon: 'mdi-waves-arrow-up',
                            label: 'Humidity',
                            value: (averageHumidity/25) + '%',
                        },
                    ];
                }
            }
            return [];
        },

    },
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