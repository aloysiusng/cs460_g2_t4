<template>
    <div>


        <v-container v-if="!loading">
            <v-skeleton-loader type="table-row-divider, table-row@10" :loading="loading" v-if="loading">
            </v-skeleton-loader>
            <LogsCard :plantData="this.plantData" />

        </v-container>
    </div>
</template>

<script>
import LogsCard from '@/components/common/LogsCard.vue';
import { useAppStore } from '@/store/app'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            plantData: null,
            loading: false,
        }
    },
    components: {
        LogsCard
    },
    mounted() {
        this.getPlantInfo();
    },
    methods: {
        async getPlantInfo() {
            this.loading = true;
            const payload = {
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
            }

            const response = await this.appStore.getPlantInfo(payload)
            this.plantData = response.data
            this.loading = false;
        }
    },
}
</script>

<style lang="scss" scoped></style>