<template>
    <v-app>
      <div class="default-bg">
        <default-view class="h-100"/>
      </div>
    </v-app>
  </template>
  
  <script>
  import DefaultView from './View.vue'
  
  export default {
    name: 'Home',
    components: {
      DefaultView
    }
  }
  </script>
  
  <style scoped>
  .default-bg {
    width: 100vw;
    min-height: 100vh;
    background-image: url('../../assets/default-bg.jpg');
    background-size: cover;
    background-repeat: repeat-y;
    opacity: 0.8; 
  }

 
  </style>
  