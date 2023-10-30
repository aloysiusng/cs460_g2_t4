<template>
    <v-card elevation="3">
        <v-card-subtitle class="py-3">
            <v-icon>mdi-cog</v-icon>
            Dashboard Configuration
        </v-card-subtitle>
        <v-card-item class="pt-0">
            <div class="d-flex flex-wrap">
                <!-- Refresh data -->
                <v-btn prepend-icon="mdi-refresh" class="my-auto" color="success">Refresh data</v-btn> 
                <v-divider vertical class="mx-3"></v-divider>
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

}
</script>

<style lang="scss" scoped></style>