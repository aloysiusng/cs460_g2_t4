<template>
    <v-card elevation="3">
        <v-card-subtitle class="py-3">
            <v-icon>mdi-cog</v-icon>
            Dashboard Configuration
        </v-card-subtitle>
        <v-card-item class="pt-0">
            <div class="d-flex flex-wrap">
                <!-- Refresh data -->
                <v-btn prepend-icon="mdi-refresh" class="my-auto mb-3 d-none d-sm-flex" color="success">Refresh data</v-btn>
                <v-btn prepend-icon="mdi-refresh" class="d-sm-none mb-3" block color="success">Refresh data</v-btn> 
                <v-divider vertical class="mx-3 d-none d-sm-flex"></v-divider>
                <v-btn prepend-icon="mdi-water" class="my-auto mb-3 d-none d-sm-flex" color="blue" @click="waterPlant()">Water Plant</v-btn> 
                <v-btn prepend-icon="mdi-water" class="d-sm-none my-auto mb-3" block color="blue" @click="waterPlant()">Water Plant</v-btn> 
                <v-divider vertical class="mx-3 d-none d-sm-flex"></v-divider>

                <!-- Export and print webpage -->
                <v-switch hide-details="auto" inset label="Live data" v-model="this.appStore.liveData" class="me-3" color="success"></v-switch>
            </div>

        </v-card-item>
    </v-card>
</template>

<script>

import { useAppStore } from '@/store/app';
export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    methods:{
        waterPlant(){
            this.$emit('waterPlant')
        }
    }

}
</script>

<style lang="scss" scoped></style>