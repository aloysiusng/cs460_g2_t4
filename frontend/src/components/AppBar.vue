<template>
    <v-container>
        <v-app-bar
        color="light-green-darken-2"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text">Dashboard</v-btn>

        <v-btn variant="text">Logs</v-btn>

        <v-btn variant="text">Settings</v-btn>

        <v-btn variant="text">Logout</v-btn>
      </v-app-bar>

      <v-navigation-drawer
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
      items: [
        {
          title: 'Foo',
          value: 'foo',
        },
        {
          title: 'Bar',
          value: 'bar',
        },
        {
          title: 'Fizz',
          value: 'fizz',
        },
        {
          title: 'Buzz',
          value: 'buzz',
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