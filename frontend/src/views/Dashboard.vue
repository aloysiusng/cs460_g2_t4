<template>
    <v-container :style="{'max-width': '1280px'}">
        <v-row>
            <v-col cols="12" v-if="!loading">
                <plant-health :lastWatered="getLastWatered()"></plant-health>
            </v-col>
            <v-col cols="12" md="4" order-md="2">
                <v-skeleton-loader type="article" :loading="loading" v-if="loading"></v-skeleton-loader>
                <v-container v-if="!loading">
                    <Summary />
                </v-container>
            </v-col>
            <v-col cols="12" md="8" order-md="1">
                <v-skeleton-loader type="image" :loading="loading" v-if="loading">
                </v-skeleton-loader>

                <v-container>
                    <v-card elevation="3" class="mb-2" v-if="!loading">
                        <ChartTemp :plantData="this.plantData" />
                    </v-card>
                </v-container>


                <v-skeleton-loader type="image" :loading="loading" v-if="loading">
                </v-skeleton-loader >

                <v-container>
                    <v-card elevation="3" class="mb-2" v-if="!loading">
                        <ChartWaterLevel :plantData="this.plantData" />
                    </v-card>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ChartTemp from '@/components/common/ChartTemp.vue';
import ChartWaterLevel from '@/components/common/ChartWaterLevel.vue';
import Summary from '@/components/common/Summary.vue';
import PlantHealth from '@/components/common/PlantHealth.vue';
import { useAppStore } from '@/store/app'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            plantData: [],
            loading: false
        }
    },
    components: {
        ChartTemp,
        ChartWaterLevel,
        Summary,
        PlantHealth
    },
    mounted() {
        // this.getPlantInfo();
    },
    methods: {
        async getPlantInfo() {
            this.loading = true;
            const payload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
            }

            const response = await this.appStore.getPlantInfo(payload)
            this.plantData = response.data
            this.loading = false
        },
        getLastWatered() {
            if (this.plantData.length>0) {
                const lastWatered = this.plantData[this.plantData.length - 1].last_watered_timestamp
                return lastWatered
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>