// Utilities
import axios from "axios";
import { defineStore } from "pinia";

const PLANTIFY_API = import.meta.env.VITE_PLANTIFY_APIGATEWAY_URL;

export const useAppStore = defineStore("app", {
  state: () => ({
    liveData: true,
  }),
  actions: {
    // Not used.... as login is mocked
    async login(emailAddress, password) {
      try {
        let response = await axios.post(`${PLANTIFY_API}/login`, {
          EmailAddress: emailAddress,
          Password: password,
        });

        // Handle the response data here
        if (response.status === 200) {
          this.saveResponseToStore(response);
          this.saveUserToLocalStorage();
        }

        return response;
      } catch (error) {
        // Handle errors here
        console.error("Login error:", error);
        return;
      }
    },
    async getPlantInfo(payload) {
      const plant_id = payload.plant_id;
      var endpoint = `${PLANTIFY_API}/get_plant_info?plant_id=${plant_id}`;

      if (payload.after_time_stamp) {
        endpoint += `&after_time_stamp=${payload.after_time_stamp}`;
      }
      if (payload.before_time_stamp) {
        endpoint += `&before_time_stamp=${payload.before_time_stamp}`;
      }
      try {
        const response = await axios.get(endpoint);

        if (response.status == 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Unable to get plantinfo: ", error);
      }
    },
    async getThresholdData(payload) {
      const plant_id = payload.plant_id;
      var endpoint = `${PLANTIFY_API}/get_threshold?plant_id=${plant_id}`;

      try {
        const response = await axios.get(endpoint);

        if (response.status == 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Unable to get plantinfo: ", error);
      }
    },
    async updateThresholdData(payload) {
      const plant_id = payload.plant_id;
      var endpoint = `${PLANTIFY_API}/post_update_threshold`;

      try {
        const response = await axios.post(endpoint, payload);

        if (response.status == 200) {
          return response;
        }
      } catch (error) {
        console.error("Unable to update: ", error);
      }
    },
    async waterPlant(payload) {
      var endpoint = `${PLANTIFY_API}/post_publish_payload_to_IoT`;

      try {
        const response = await axios.post(endpoint, payload);

        if (response.status == 200) {
          return response;
        }
      } catch (error) {
        console.error("Unable to water plant: ", error);
      }
    },
    async publishThresholdToDevice(payload) {
      var endpoint = `${PLANTIFY_API}/post_publish_threshold_to_IoT`;

      try {
        const response = await axios.post(endpoint, payload);

        if (response.status == 200) {
          return response;
        }
      } catch (error) {
        console.error("Unable to publish threshold: ", error);
      }
    },

    async fetchWeatherData(location) {
      //   {
      //     "coord": {
      //         "lon": 103.8501,
      //         "lat": 1.2897
      //     },
      //     "weather": [
      //         {
      //             "id": 803,
      //             "main": "Clouds",
      //             "description": "broken clouds",
      //             "icon": "04d"
      //         }
      //     ],
      //     "base": "stations",
      //     "main": {
      //         "temp": 29.71,
      //         "feels_like": 36.71,
      //         "temp_min": 28.92,
      //         "temp_max": 31.25,
      //         "pressure": 1011,
      //         "humidity": 81
      //     },
      //     "visibility": 8000,
      //     "wind": {
      //         "speed": 2.06,
      //         "deg": 330
      //     },
      //     "clouds": {
      //         "all": 75
      //     },
      //     "dt": 1698717770,
      //     "sys": {
      //         "type": 2,
      //         "id": 265581,
      //         "country": "SG",
      //         "sunrise": 1698705961,
      //         "sunset": 1698749418
      //     },
      //     "timezone": 28800,
      //     "id": 1880252,
      //     "name": "Singapore",
      //     "cod": 200
      // }

      // Define your API endpoint and API key 
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

      try {
        // Use Axios to make the API request.
        const response = await axios.get(apiUrl);

        if(response.status==200){
            return response
        }

      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null; // Return null in case of an error
      }
    },
    async fetchForecastWeatherData(location) {
        // Define your API endpoint and API key 
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

      try {
        // Use Axios to make the API request.
        const response = await axios.get(apiUrl);

        if(response.status==200){
            return response
        }

      } catch (error) {
        console.error("Error fetching weather data:", error);
        return null; // Return null in case of an error
      }
    }
  },
});
