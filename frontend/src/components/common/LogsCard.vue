<template>
    <v-card>
        <v-data-table>
            <thead>
                <tr>
                <th class="text-left">
                    Timestamp
                </th>
                <th class="text-left">
                    Humidity Level
                </th>
                <th class="text-left">
                    Moisture Level
                </th>
                <th class="text-left">
                    Water Level
                </th>
                <th class="text-left">
                    Sunlight Level
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="plant in plantData"
                :key="plant.plant_id"
                >
                <td>{{ plant.timestamp }}</td>
                <td>{{ plant.humidity_level }} <v-progress-linear model-value=plant.humidity_level height="8" color="blue" rounded></v-progress-linear></td>
                <td>{{ plant.moisture_level }}</td>
                <td>{{ plant.water_level }}</td>
                <td>{{ plant.sunlight_level }}</td>
                </tr>
            </tbody>
        </v-data-table>
    </v-card>
  </template>

  <script>
    export default {
        props: {
            plantData: Object
        }, 
        data () {
        return {
          options: {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          },
        }
      },
      mounted(){
        console.log(this.plantData)
        if (this.plantData) {
          this.formatData(this.plantData)
        }
      },
      methods: {
        formatData(plantData) {
          for (var data of plantData) {
            data.timestamp = new Date(data.timestamp).toLocaleString("en-US", this.options)
          }
        }
        // formatData(plantData) {
        //   for (var data of plantData) {
        //     data.timestamp = new Date(data.timestamp).toISOString()
        //     data.timestamp = data.timestamp.slice(0, 10) + " " + data.timestamp.slice(11, 19)
          }
        }
  </script>