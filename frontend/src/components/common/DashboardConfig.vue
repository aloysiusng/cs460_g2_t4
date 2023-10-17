<template>
    <v-card elevation="3">
        <v-card-subtitle class="py-3">
            <v-icon>mdi-cog</v-icon>
            Dashboard Configuration
        </v-card-subtitle>
        <v-card-item class="pt-0">
            <div class="d-flex flex-wrap">
                <v-switch hide-details="auto" inset label="Live data" v-model="this.appStore.liveData" class="me-3"></v-switch>
                <!-- Export and print webpage -->
                <v-btn prepend-icon="mdi-export" class="me-3">Export dashboard</v-btn>
                <!-- dark-mode -->
                <v-btn prepend-icon="mdi-lightbulb-on" color="black">Dark mode</v-btn>

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
    }
}
</script>

<style lang="scss" scoped></style>