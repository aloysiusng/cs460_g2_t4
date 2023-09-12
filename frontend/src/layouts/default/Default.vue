<template>
  <v-app>
    <AppBar />

    <default-view />
  </v-app>
</template>

<script>
import DefaultView from './View.vue'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'Home',
  components: {
    AppBar,
    DefaultView
  }
}
</script>
