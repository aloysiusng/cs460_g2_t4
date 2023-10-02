<template>
    <v-container style="max-width: 1280px;">
        <h1 class="heading-1 font-weight-medium text-center">Welcome back to Plantify!</h1>
    </v-container>
    <v-container>
        <Chart/>
    </v-container>
</template>

<script>
import Chart from '@/components/common/Chart.vue';

export default {
    setup () {
        
        return {}
    },
    components: {
        Chart
    }
}
</script>

<style lang="scss" scoped>

</style>