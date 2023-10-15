<template>
    <v-container>
        <v-app-bar prominent>

            <v-container class="d-flex my-auto pa-0" style="max-width: 1280px;">
                <div class="d-block d-sm-none d-md-none d-lg-none d-xl-none">
                    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                </div>

                <v-img cover src="@/assets/plantify-logo-horizontal.png" max-height="50" max-width="150" contain></v-img>
                <v-spacer></v-spacer>

                <div class="d-none d-md-block d-sm-block my-auto">
                    <v-btn rounded variant="text" to="/">Dashboard</v-btn>
                    <v-btn rounded variant="text" to="logs">Logs</v-btn>

                </div>

                <v-spacer></v-spacer>

                <div class="d-none d-md-block d-sm-block my-auto">
                    <v-menu location="bottom" class="my-auto">
                        <template v-slot:activator="{ props }">
                            <v-avatar v-bind="props" image="https://randomuser.me/api/portraits/women/2.jpg"
                                class="my-auto">
                            </v-avatar>
                            <v-icon v-bind="props">mdi-chevron-down</v-icon>
                        </template>
                        <v-list>
                            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/2.jpg" title="Admin"
                                class="mb-3">
                            </v-list-item>
                            <v-divider></v-divider>

                            <v-list-item>
                                <dark-mode-button />
                            </v-list-item>

                            <v-list-item @click="logout">
                                <v-icon left dark class="me-2" color="red-lighten-1">mdi-logout-variant</v-icon>
                                Logout
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>





            </v-container>



        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="bottom" temporary>

            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/2.jpg" title="Admin" class="my-3">
            </v-list-item>
            <v-list-item>
                <dark-mode-button />
            </v-list-item>
            <v-divider class="my-3"></v-divider>
            <v-list :items="items"></v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script>
import DarkMode from '@/components/common/DarkMode.vue';
import DarkModeButton from '@/components/common/DarkModeButton.vue'

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
                title: 'Logout',
                value: 'logout',
            },
        ],
    }),
    watch: {
        group() {
            this.drawer = false
        },
    },
    methods: {
        logout() {


            // clear user storage
            localStorage.removeItem("plantifyUserInfo")

            //redirect user to login page
            this.$router.push({ path: '/account/login' })
        }
    },
    components: {
        DarkMode,
        DarkModeButton
    }
}
</script>

<style>
@font-face {
    font-family: 'lazy dog';
    src: url('~@/assets/fonts/lazy_dog.ttf') format('truetype');
}
</style>