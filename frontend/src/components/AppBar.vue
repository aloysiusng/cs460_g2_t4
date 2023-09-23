<template>
    <v-container>
        <v-app-bar
        color="light-green-darken-2"
        prominent
      >
        
      <div class="d-block d-sm-none d-md-none d-lg-none d-xl-none">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>

      <v-btn to="/">
        <v-toolbar-title>Plantify</v-toolbar-title>
      </v-btn>
        

        <v-spacer></v-spacer>

        <div class="d-none d-md-block d-sm-block">
          <!-- <router-link :to="{ path: 'dashboard'}"><v-btn variant="text">Dashboard</v-btn></router-link>
          <router-link :to="{ path: 'logs'}"><v-btn variant="text">Logs</v-btn></router-link>
          <router-link :to="{ path: 'settings'}"><v-btn variant="text">Settings</v-btn></router-link>
          <router-link :to="{ path: 'login'}"><v-btn variant="text">Logout</v-btn></router-link> -->
          <v-btn variant="text" to="dashboard">Dashboard</v-btn>
          <v-btn variant="text" to="logs">Logs</v-btn>
          <v-btn variant="text" to="settings">Settings</v-btn>
          <v-btn variant="text" to="login">Logout</v-btn>
        </div>


      </v-app-bar>
      
      <v-navigation-drawer
        v-model="drawer"
        location="bottom"
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
    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>