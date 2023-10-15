// Utilities
import axios from "axios";
import { defineStore } from "pinia";

const PLANTIFY_API = import.meta.env.VITE_PLANTIFY_APIGATEWAY_URL;

export const useAppStore = defineStore("app", {
  state: () => ({
    //
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

      if (payload.after_timestamp) {
        endpoint += `&after_timestamp=${payload.after_timestamp}`;
      }
      if (payload.before_timestamp) {
        endpoint += `&before_timestamp=${payload.before_timestamp}`;
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
  },
});
