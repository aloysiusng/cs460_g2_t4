<template>
    <v-app>
      <AppBar />
  
      <default-view/>
  
      <AppFooter />
    </v-app>
  </template>
  
  <script>
  import DefaultView from './View.vue'
  import AppBar from '@/components/common/AppBar.vue'
  import AppFooter from '@/components/common/AppFooter.vue'
  
  export default {
    name: 'Home',
    components: {
      AppBar,
      AppFooter,
      DefaultView
    }
  }
  </script>
  