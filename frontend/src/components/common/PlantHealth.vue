<template>
    <template v-if="checkPlantHealth()">
        <v-alert title="Plant is unhealthy" icon="$error" text="Plant is unhealthy, last watered at " color="error">
            {{ formattedDate() }}
        </v-alert>
    </template>
    <template v-else>
        <v-alert title="Plant is healthy" icon="$success" text="Your plant is current in healthy condition 😊, last watered at " color="success">
            {{ formattedDate() }}
        </v-alert>
    </template>
</template>

<script>
export default {
    setup() {


        return {}
    },
    props: {
        lastWatered: String
    },
    methods: {
        formattedDate() {

            if (this.lastWatered) {
                // format to local date time string
                const [hours, minutes] = this.lastWatered.split(':');
                const hour = parseInt(hours, 10);
                const minute = parseInt(minutes, 10);
                const ampm = hour >= 12 ? 'pm' : 'am';
                const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 am

                return `${formattedHour}:${String(minute).padStart(2, '0')} ${ampm}`;
            }
        },
        checkPlantHealth(){
            if(this.lastWatered){
                const [hours, minutes] = this.lastWatered.split(':');
                const hour = parseInt(hours, 10);
                const minute = parseInt(minutes, 10);
                const ampm = hour >= 12 ? 'pm' : 'am';
                const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 am

                const lastWatered = new Date();
                lastWatered.setHours(formattedHour);
                lastWatered.setMinutes(minute);
                lastWatered.setSeconds(0);
                lastWatered.setMilliseconds(0);

                const now = new Date();
                const diff = now.getTime() - lastWatered.getTime();
                const diffInMinutes = Math.round(diff / 60000);

                if(diffInMinutes > 300){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }
}
</script>

