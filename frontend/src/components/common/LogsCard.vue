<template>
  <!-- {{ plantData  }} -->
    <v-card v-if="plantData && !loading">
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="data"
            item-value="time_stamp"
            >
            <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.time_stamp }}</td>
        <td>{{ item.humidity_level }}</td>
        <td>{{ item.moisture_level }}</td>
        <td>{{ item.water_level }}</td>
        <td>{{ item.sunlight_level }}</td>
      </tr>
    </template>
            <!-- <tbody>
                <tr
                v-for="plant in plantData"
                :key="plant.plant_id"
                >
                <td>{{ plant.time_stamp }}</td>
                <td>{{ plant.humidity_level }}</td>
                <td>{{ plant.moisture_level }}</td>
                <td>{{ plant.water_level }}</td>
                <td>{{ plant.sunlight_level }}</td>
                </tr>
            </tbody> -->
        </v-data-table>
    </v-card>
  </template>

  <script>
  import { VDataTableServer } from 'vuetify/labs/VDataTable'
    export default {
        props: {
            plantData: Array
        }, 
        data () {
        return {
          components: {
            VDataTableServer
          },
          data: [
          { sunlight_level: 0, time_stamp: "10/15/2023, 05:18:17 PM", water_level: 0, humidity_level: null, moisture_level: 1 },
          ],
          loading: true,
          itemsPerPage: 10,
          headers: [
            {
              title: "Time Stamp",
              align: "left",
              sortable: true,
              key: "time_stamp",
            },  
            { title: "Humidity Level", key: "humidity_level" },
            { title: "Moisture Level", key: "moisture_level" },
            { title: "Water Level", key: "water_level" },
            { title: "Sunlight Level", key: "sunlight_level" },
          ],
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
          this.loading = false
          this.formatTimestamp(this.plantData)
        }
      },
      methods: {
        formatTimestamp(plantData) {
          for (var data of plantData) {
            data.time_stamp = new Date(data.time_stamp).toLocaleString("en-US", this.options)
          }
        },
      }
    }
  </script>