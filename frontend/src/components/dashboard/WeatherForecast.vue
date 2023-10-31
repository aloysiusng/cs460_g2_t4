<template>
    <v-card>
        <v-card-title class="text-h6 font-weight-medium text-start">
            <v-icon class="me-3">mdi-weather-cloudy</v-icon>Weather
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-skeleton-loader type="text, text" v-if="loading"></v-skeleton-loader>
            <v-card color="info" variant="outlined" v-else>
                <v-card-title>Current Weather</v-card-title>
                <v-card-item v-if="weatherData">
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-city</v-icon>
                        <p class="text-title font-weight-medium">Location</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ weatherData.city }}</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-thermometer</v-icon>
                        <p class="text-title font-weight-medium">Temperature</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ weatherData.temperature }} °C</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Humidity</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ weatherData.humidity }}%</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-cloud</v-icon>
                        <p class="text-title font-weight-medium">Weather</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ weatherData.weatherDescription }}</p>
                    </div>
                </v-card-item>
                <div v-else>
                    <v-card-text class="pt-0">No weather forecast data available.</v-card-text>
                </div>
                <v-card-item class="py-0">
                    <v-divider></v-divider>
                </v-card-item>
                <!-- Loop through forecastData and display time, temperature, humidity, weather description -->
                <v-card-title>3 Hr Forecast</v-card-title>
                <v-card-item v-if="forecastData">
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-clock-outline</v-icon>
                        <p class="text-title font-weight-medium">Time</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ formatTime(forecastDataNext3Hours.dt) }}</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-thermometer</v-icon>
                        <p class="text-title font-weight-medium">Temperature</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ forecastDataNext3Hours.main.temp }} °C</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-waves-arrow-up</v-icon>
                        <p class="text-title font-weight-medium">Humidity</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ forecastDataNext3Hours.main.humidity }}%</p>
                    </div>
                    <div class="d-flex mb-3">
                        <v-icon color="green" size="20" class="me-3">mdi-cloud</v-icon>
                        <p class="text-title font-weight-medium">Weather</p>
                        <v-spacer></v-spacer>
                        <p class="text-title">{{ forecastDataNext3Hours.weather[0].description }}</p>
                    </div>
                </v-card-item>
            </v-card>
        </v-card-text>
    </v-card>
</template>
  
<script>
import { useAppStore } from '@/store/app';

export default {
    props: {
        location: String, // Pass the location for which you want weather forecast
    },
    setup() {
        const appStore = useAppStore()
        return { appStore }
    },
    data() {
        return {
            weatherData: null,
            forecastData: null,
            loading: false,
        };
    },
    async mounted() {
        // Fetch weather forecast data from an external API using 'location'
        this.loading = true;
        try {
            // Make an API request and assign the response to weatherData
            await this.fetchWeatherData(this.location);
            await this.fetchForecastWeatherData(this.location);
            this.loading = false;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            this.loading = false;
        }
    },
    computed: {
        forecastDataNext3Hours() {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return this.forecastData.list.find((entry) => entry.dt > currentTime && entry.dt <= currentTime + 3 * 3600);
        },
    },
    methods: {
        // Define a function to fetch weather data from an API
        async fetchWeatherData(location) {
            const response = await this.appStore.fetchWeatherData(location)

            console.log(response);

            if (response.status == 200) {
                this.weatherData = {
                    city: response.data.name,
                    temperature: response.data.main.temp,
                    weatherDescription: response.data.weather[0].description,
                    humidity: response.data.main.humidity,
                };
            }

        },
        async fetchForecastWeatherData(location) {
            const response = await this.appStore.fetchForecastWeatherData(location)

            console.log(response);

            if (response.status == 200) {
                this.forecastData = response.data
            }
        },
        formatTime(timestamp) {
            const date = new Date(timestamp * 1000);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        },
    },
};
</script>
  