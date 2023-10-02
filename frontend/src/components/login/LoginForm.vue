<template>
    <v-container class="h-100" style="max-width: 1280px;">
        <v-row class="fill-height align-center">
            <v-col cols="12" md="6">
                <v-img class="mx-auto" max-width="300" src="@/assets/plantify-logo.png"></v-img>
            </v-col>
            <v-col cols="12" md="6">

                <v-card class="mx-auto my-auto h-100 pa-12" elevation="8" max-width="448" rounded="lg">
                    <h3 class="mb-5 text-subtitle-3">
                        Hey there! Good to see you back 🌻
                    </h3>
                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                        variant="outlined" v-model="loginData.email"></v-text-field>

                    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Password
                    </div>

                    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                        prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                        v-model="loginData.password"></v-text-field>

                    <v-card class="mb-12" color="surface-variant" variant="tonal" v-if="error.show">
                        <v-card-text class="text-medium-emphasis text-caption">
                            {{ error.message }}
                        </v-card-text>
                    </v-card>

                    <v-btn block color="teal" size="large" @click.prevent="login()" :loading="this.loading">
                        Log In
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            loading: false,
            loginData: {
                email: '',
                password: ''
            },
            error: {
                show: false,
                message: ''
            }
        }
    },
    computed: {

    },
    methods: {
        login() {

            this.loading=true;

            // Admin credentials
            const admin = {
                email: 'admin@plantify.com',
                password: 'admin'
            }

            // validation 
            if (this.loginData.email == '' || this.loginData.password == '') {
                this.error.message = 'Please fill in all fields'
            }

            if (this.loginData.email.toUpperCase() == admin.email.toUpperCase() && this.loginData.password == admin.password) {
                localStorage.setItem("plantifyUserInfo", JSON.stringify(this.loginData));
                this.$router.push('/dashboard')
            } else {
                this.error.show = true
                this.error.message = 'Invalid credentials'
            }

            this.loading=false;
        }
    }
}
</script>
