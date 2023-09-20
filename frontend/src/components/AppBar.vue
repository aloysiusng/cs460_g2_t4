<template>
    <v-container>
        <v-app-bar
        color="light-green-darken-2"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title></v-toolbar-title>

        <v-spacer></v-spacer>

        <router-link :to="{ path: 'dashboard'}"><v-btn variant="text">Dashboard</v-btn></router-link>

        <router-link :to="{ path: 'logs'}"><v-btn variant="text">Logs</v-btn></router-link>

        <router-link :to="{ path: 'settings'}"><v-btn variant="text">Settings</v-btn></router-link>

        <v-btn variant="text">Logout</v-btn>
      </v-app-bar>

      <v-navigation-drawer v-show="mobile"
        v-model="drawer"
        location="left"
        temporary
      >
        <v-list
          :items="items"
        ></v-list>
      </v-navigation-drawer>
    </v-container>
</template>

<script>
  export default {
    data: () => ({
      drawer: false,
      group: null,
      mobile: null,
      windowWidth: null,
      items: [
        {
          title: 'Dashboard',
          value: 'dashboard',
        },
        {
          title: 'Logs',
          value: 'logs',
        },
        {
          title: 'Settings',
          value: 'settings',
        },
        {
          title: 'Logout',
          value: 'logout',
        },
      ],
    }),
    created () {
      window.addEventListener('resize', this.checkScreen)
      this.checkScreen()
    },
    methods: {
      checkScreen() {
        this.windowWidth = window.innerWidth
        if (this.windowWidth < 960) {
          this.mobile = true
        } else {
          this.mobile = false
        }
      }
    },

    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>