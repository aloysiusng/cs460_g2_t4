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
                        <p class="text-title">28°C</p>
                    </div>
                </v-card-item>
                <v-card-item>
                    <div class="d-flex">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Humidity</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">28°C</p>
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
                    v-model="temperature"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    suffix="°C">
                </v-text-field>
                <v-text-field
                    label="Humidity"
                    outlined
                    class="mt-3"
                    v-model="humidity"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    suffix="%">
                </v-text-field>
                <v-btn color="green" class="mt-3" block>Save</v-btn>
            </v-form>
        </v-card-item>
    </v-card>
</template>
  
<script>
export default {
    props: {
        
    },
    data() {
        return {
            temperature: 0,
            humidity: 0,
        }
    },
    mounted() {
        
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