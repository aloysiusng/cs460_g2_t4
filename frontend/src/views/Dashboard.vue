<template>
    <v-container style="max-width: 1280px;">
        <h1 class="heading-1 font-weight-medium text-center">Welcome back to Plantify!</h1>
    </v-container>
    
    {{ thresholdData }}
    <v-container v-if="loading">
        <v-row>
            <v-col cols="8" md="8" order-md="1">
                <v-skeleton-loader type="image" :loading="loading" v-if="loading">
                </v-skeleton-loader>
                <v-skeleton-loader type="image" :loading="loading" v-if="loading">
                </v-skeleton-loader>
            </v-col>
            <v-col cols="4" md="4" order-md="2">
                <v-skeleton-loader type="table-heading" :loading="loading" v-if="loading">
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-if="plantData">
        <v-row>
            <v-col cols="12" md="4" order-md="2">
                <v-container>
                    <Summary />
                </v-container>
            </v-col>
            <v-col cols="12" md="8" order-md="1">
                <v-container>
                    <v-card elevation="2" class="mb-2" v-if="!loading">
                        <ChartTemp :plantData="this.plantData" />
                    </v-card>
                </v-container>
                <v-container>
                    <v-card elevation="2" class="mb-2" v-if="!loading">
                        <ChartWaterLevel :plantData="this.plantData" />
                    </v-card>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-if=" loading == false && plantData == null ">
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
</template>

<script>
import ChartTemp from '@/components/common/ChartTemp.vue';
import ChartWaterLevel from '@/components/common/ChartWaterLevel.vue';
import Summary from '@/components/common/Summary.vue';
import { useAppStore } from '@/store/app'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            plantData: [],
            thresholdData: null,
            loading: false
        }
    },
    components: {
        ChartTemp,
        ChartWaterLevel,
        Summary
    },
    mounted() {
        // this.getPlantInfo();
        this.getThreshold();
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
    }
}
</script>

<style lang="scss" scoped></style>