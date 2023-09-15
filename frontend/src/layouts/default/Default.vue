<template>
  <v-app>
    <AppBar />

    <default-view />

    <Footer />
  </v-app>
</template>

<script>
import DefaultView from './View.vue'
import AppBar from '@/components/AppBar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    AppBar,
    Footer,
    DefaultView
  }
}
</script>
