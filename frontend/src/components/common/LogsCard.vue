<template>
    <v-card v-if="plantData && !loading">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="plantData" density="compact">
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    props: {
        plantData: Object
    },
    data() {
        return {
            loading: true,
            itemsPerPage: 50,
            headers: [
                {
                    title: "Time Stamp",
                    align: "left",
                    sortable: true,
                    key: "time_stamp",
                },
                { title: "Humidity Level", key: "humidity_level" },
                { title: "Temperature", key: "temperature" },
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
    mounted() {
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