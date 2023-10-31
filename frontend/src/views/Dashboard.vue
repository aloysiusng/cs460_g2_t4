<template>
    <v-container>
        <v-container :style="{ 'max-width': '1600px' }">
            <v-row>
                <v-col cols="12" v-if="!firstLoading">
                    <plant-health :lastWatered="getLastWatered()" v-if="getLastWatered()"></plant-health>
                </v-col>
                <v-col cols="12" md="3">
                    <v-container v-if="!firstLoading">
                        <Summary :plantData="plantData"/>
                    </v-container>
                    <v-container v-if="!firstLoading">
                        <WeatherForecast location="Singapore" />
                    </v-container>
                    

                </v-col>
                <v-col cols="12" md="6">
                    <v-container>
                        <dashboard-config class="mb-5" @waterPlant="waterPlant"/>
                        <v-skeleton-loader type="heading, image" v-if="firstLoading"></v-skeleton-loader>

                        <v-card elevation="3" class="mb-2" v-if="!firstLoading">
                            <ChartTemp :plantData="this.plantData" />
                        </v-card>
                    </v-container>
                    <v-container class="pt-0">
                        <v-skeleton-loader type="heading, image" v-if="firstLoading"></v-skeleton-loader>

                        <v-card elevation="3" class="mb-2" v-if="!firstLoading">
                            <ChartWaterLevel :plantData="this.plantData" @refresh-data="this.getPlantInfo()" />
                        </v-card>
                    </v-container>
                </v-col>
                <v-col cols="12" md="3">
                    <v-container v-if="!firstLoading">
                        <ThresholdForm :thresholdData="this.thresholdData"/>
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
    <template>
        <Modal v-model="modal.show" :title="modal.title" :message="modal.message" :icon="modal.icon"
            :color="modal.color" @closeModal="closeModal()" :closeOnClick="true"/>
    </template>
</template>

<script>
import ChartTemp from '@/components/dashboard/ChartTemp.vue';
import ChartWaterLevel from '@/components/dashboard/ChartWaterLevel.vue';
import Summary from '@/components/dashboard/Summary.vue';
import PlantHealth from '@/components/dashboard/PlantHealth.vue';
import DashboardConfig from '@/components/dashboard/DashboardConfig.vue';
import ThresholdForm from '@/components/dashboard/ThresholdForm.vue';
import Modal from '@/components/common/Modal.vue'
import WeatherForecast from '@/components/dashboard/WeatherForecast.vue';
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
            firstLoading: true,
            modal: {
                show: false,
                title: '',
                message: '',
                icon: '',
                color: ''
            }
        }
    },
    components: {
        ChartTemp,
        ChartWaterLevel,
        Summary,
        PlantHealth,
        DashboardConfig,
        ThresholdForm,
        Modal,
        WeatherForecast
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
        await this.getPlantInfo();
        await this.getThreshold();
        this.firstLoading = false
        this.startPolling();
    },
    beforeUnmount() {
        this.stopPolling(); // Stop polling when the component is unmounted
    },
    methods: {
        startPolling() {
            console.log("polling started....")
            if (this.appStore.liveData) {
                this.pollIntervalId = setInterval(async () => {
                    await this.getPlantInfo();
                }, 2000)
            }
        },
        stopPolling() {
            console.log("stopped polling")
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
        },
        async waterPlant(){
            const requestPayload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
                payload: {
                    water_actuation: true
                }
            }
            const response = await this.appStore.waterPlant(requestPayload)

            if (response.status === 200) {
                this.modal.type = "success"
                this.modal.icon = "mdi-check-circle"
                this.modal.title = "Watering Success"
                this.modal.message = "Your plant will be watered shortly"
                this.modal.color = "success"
                this.modal.show = true;
                console.log(response)
            } else {
                console.log("error")
            }

        },
        closeModal(){
            this.modal.show = false
        }
    },

}
</script>

<style lang="scss" scoped></style>