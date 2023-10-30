<template>
    <v-card>
        <v-card-title  class="text-h6 font-weight-medium text-start"><v-icon class="me-3">mdi-format-list-bulleted</v-icon>Threshold </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-card>
                <v-card-title>Edit Threshold</v-card-title>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-thermometer</v-icon>
                        <p class="text-title font-weight-medium">Temperature</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ temperature }} °C</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Moisture</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ moisture }} %</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-water</v-icon>
                        <p class="text-title font-weight-medium">Water Level</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ waterLevel }} ml</p>
                    </div>
                </v-card-item>
            </v-card>
        </v-card-text>
        <v-card-item>
        </v-card-item>
        <v-card-item>
            <v-form>
                <v-text-field
                    label="Temperature"
                    outlined
                    class="mt-3"
                    v-model="temperatureInput"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    suffix="°C">
                </v-text-field>
                <v-text-field
                    label="Moisture"
                    outlined
                    class="mt-3"
                    v-model="moistureInput"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    suffix="%">
                </v-text-field>
                <v-text-field
                    label="Water Level"
                    outlined
                    class="mt-3"
                    v-model="waterLevelInput"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    suffix="ml">
                </v-text-field>
                <v-btn @click="updateThreshold" color="green" class="mt-3" block>Update</v-btn>
            </v-form>
        </v-card-item>
    </v-card>
    <template>
        <Modal v-model="modal.show" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeModal" :color="modal.color" :closeOnClick="true"/>
    </template>
</template>
  
<script>
import { useAppStore } from '@/store/app'
import Modal from '@/components/common/Modal.vue'

export default {
    props: {
        thresholdData: Object
    },
    setup(){
        const appStore = useAppStore()
        return { appStore }
    },
    components:{
        Modal
    },
    data() {
        return {
            temperature: this.thresholdData[0].temperature_threshold,
            moisture: this.thresholdData[0].min_moisture_level,
            waterLevel: this.thresholdData[0].min_water_level,
            temperatureInput: this.thresholdData[0].temperature_threshold,
            moistureInput: this.thresholdData[0].min_moisture_level,
            waterLevelInput: this.thresholdData[0].min_water_level,
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Update Success",
                message: "Threshold has been updated",
                color: "success"
            }
        }
    },
    methods: {
        async updateThreshold() {
            const payload = {
                min_water_level: this.waterLevelInput,
                moisture_threshold: this.moistureInput,
                plant_id: "c325ae6d-5554-4605-bac1-b5bad7af14e1",
                temperature_threshold: this.temperatureInput,
                water_threshold: this.waterLevelInput,
                min_moisture_level: this.moistureInput,
            }
            const response = await this.appStore.updateThresholdData(payload)
            if (response.status === 200) {
                console.log(response.data)
                this.temperature = this.temperatureInput
                this.moisture = this.moistureInput
                this.waterLevel = this.waterLevelInput
                this.modal.type = "success"
                this.modal.icon = "mdi-check-circle"
                this.modal.title = "Update Success"
                this.modal.message = response.data.message
                this.showModal();
            } else {
                this.modal.type = "error"
                this.modal.icon = "mdi-alert-circle"
                this.modal.title = "Update Failed"
                this.modal.message = "Something went wrong"
                this.modal.color = "error"
                this.showModal();
            }

        },
        closeModal() {
            this.modal.show = false
        },
        showModal() {
            this.modal.show = true

        },
    },
}
</script>
  
<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

#colorPicker {
    border: 0;
    padding: 0;
    margin: 0;
    width: 30px;
    height: 30px;
}

.numberInput {
    width: 30px;
}
</style>