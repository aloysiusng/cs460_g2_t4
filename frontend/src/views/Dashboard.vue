<template>
    <v-container>
        <v-container :style="{ 'max-width': '1280px' }">
            <v-row>
                <v-col cols="12" v-if="!loading">
                    <plant-health :lastWatered="getLastWatered()"></plant-health>
                </v-col>
                <v-col cols="12">
                    <dashboard-config />
                </v-col>
                <v-col cols="12" md="4" order-md="2">
                    <v-container>
                        <Summary />
                    </v-container>
                </v-col>
                <v-col cols="12" md="8" order-md="1">
                    <v-container>
                        <v-skeleton-loader type="heading, image" v-if="firstLoading"></v-skeleton-loader>

                        <v-card elevation="3" class="mb-2" v-if="!firstLoading">
                            <ChartTemp :plantData="this.plantData" />
                        </v-card>
                    </v-container>
                    <v-container>
                        <v-skeleton-loader type="heading, image" v-if="firstLoading"></v-skeleton-loader>

                        <v-card elevation="3" class="mb-2" v-if="!firstLoading">
                            <ChartWaterLevel :plantData="this.plantData" @refresh-data="this.getPlantInfo()" />
                        </v-card>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-if="loading == false && plantData == null">
            <v-card>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <p class="text-h6 font-weight-medium text-center"> No data available </p>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
    </v-container>
</template>

<script>
import ChartTemp from '@/components/common/ChartTemp.vue';
import ChartWaterLevel from '@/components/common/ChartWaterLevel.vue';
import Summary from '@/components/common/Summary.vue';
import PlantHealth from '@/components/common/PlantHealth.vue';
import DashboardConfig from '@/components/common/DashboardConfig.vue';
import { useAppStore } from '@/store/app'


export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            plantData: [],
            thresholdData: [],
            loading: false,
            pollIntervalId: null,
            firstLoading: false,
        }
    },
    components: {
        ChartTemp,
        ChartWaterLevel,
        Summary,
        PlantHealth,
        DashboardConfig
    },
    watch: {
        'appStore.liveData': function (newLiveDataValue) {
            // The 'appStore.liveData' value has changed, update polling accordingly.
            if (newLiveDataValue) {
                this.startPolling();
            } else {
                this.stopPolling();
            }
        },
    },
    async mounted() {
        this.firstLoading = true;
        await this.getPlantInfo();
        this.firstLoading = false
        this.startPolling();
    },
    beforeUnmount() {
        this.stopPolling(); // Stop polling when the component is unmounted
    },
    methods: {
        startPolling() {
            if (this.appStore.liveData) {
                this.pollIntervalId = setInterval(async () => {
                    await this.getPlantInfo();
                }, 2000)
            }
        },
        stopPolling() {
            if (this.pollIntervalId !== null) {
                clearInterval(this.pollIntervalId);
                this.pollIntervalId = null;
            }
        },
        async getPlantInfo() {
            this.loading = true;
            const payload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
            }

            const response = await this.appStore.getPlantInfo(payload)
            this.plantData = response.data
            this.loading = false

        },
        async getThreshold() {
            this.loading = true;
            const payload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
            }

            const response = await this.appStore.getThresholdData(payload)
            this.thresholdData = response.data
            this.loading = false

        },
        async updateThreshold() {
            this.loading = true;
            const payload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
            }

            const response = await this.appStore.updateThresholdData(payload)
            this.thresholdData = response.data
            this.loading = false

        },
        getLastWatered() {
            if (this.plantData.length > 0) {
                const lastWatered = this.plantData[this.plantData.length - 1].last_watered_timestamp
                return lastWatered
            }
        }
    },

}
</script>

<style lang="scss" scoped></style>