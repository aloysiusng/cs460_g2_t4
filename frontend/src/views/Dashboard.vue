<template>
    <v-container style="max-width: 1280px;">
        <h1 class="heading-1 font-weight-medium text-center">Welcome back to Plantify!</h1>
    </v-container>
    <v-container>
        <v-row>
            <v-col cols="8">
                <ChartTemp />
                <ChartWaterLevel />
            </v-col>
            <v-col cols="4">
                <Summary />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ChartTemp from '@/components/common/ChartTemp.vue';
import ChartWaterLevel from '@/components/common/ChartWaterLevel.vue';
import Summary from '@/components/common/Summary.vue';

export default {
    setup () {
        
        return {}
    },
    components: {
        ChartTemp,
        ChartWaterLevel,
        Summary
    }
}
</script>

<style lang="scss" scoped>

</style>