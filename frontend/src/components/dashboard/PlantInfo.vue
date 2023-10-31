<template>
    <v-card elevation="3" class="mb-3">
        <v-card-title class="text-h6 font-weight-medium text-start"><v-icon class="me-3" color="success">mdi-sprout</v-icon>Plant
            Information</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <div class="d-flex">
                <v-icon color="primary" size="20" class="me-3">mdi-information</v-icon>
                <p class="text-title font-weight-medium">Plant ID: c325ae6d-5554-4605-bac1-b5bad7af14e1</p>
            </div>
        </v-card-text>
    </v-card>
</template>
  
<script>
import { useAppStore } from '@/store/app'

export default {
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },

    data() {

    },
    methods: {

    },
}
</script>
  