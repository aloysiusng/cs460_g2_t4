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
    async waterPlant(payload){
        var endpoint = `${PLANTIFY_API}/post_publish_payload_to_IoT`;
    
        try {
            const response = await axios.post(endpoint, payload);
    
            if (response.status == 200) {
                return response;
            }
        } catch (error) {
            console.error("Unable to water plant: ", error);
        }
    }
  },
});
