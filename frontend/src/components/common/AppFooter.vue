<template>
    <v-footer class="d-flex flex-column pa-0">
      <div class="bg-light-green-darken-2 d-flex w-100 align-center">
            <v-container>
                <v-row class="d-flex d-columns align-center">
                    <v-col>
                        <p class="text-body text-start align-center">Plantify - {{ new Date().getFullYear() }}</p>
                    </v-col>           
                </v-row>
            </v-container>
        </div>
    </v-footer>
  </template>

<script>
  export default {
    name: 'AppFooter',
  }
</script>


