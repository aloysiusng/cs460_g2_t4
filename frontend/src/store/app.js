// Utilities
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAppStore = defineStore('app', {
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
  }
})
