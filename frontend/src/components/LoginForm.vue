<template>
    <div>
        <v-img class="mx-auto" max-width="300" src="@/assets/plantify-logo.png"></v-img>

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">

            <v-card-title class="text-wrap text-center">
                Login to Plantify
            </v-card-title>
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                variant="outlined" v-model="loginData.email"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Password</div>

            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                @click:append-inner="visible = !visible" v-model="loginData.password"></v-text-field>

            <v-card class="mb-12" color="surface-variant" variant="tonal" v-if="error.show">
                <v-card-text class="text-medium-emphasis text-caption">
                    {{ error.message }}
                </v-card-text>
            </v-card>

            <v-btn block class="mb-8" color="teal" size="large" @click.prevent="login()">
                Log In
            </v-btn>


        </v-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
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
                this.$router.push('/dashboard')
            } else {
                this.error.show = true
                this.error.message = 'Invalid credentials'
            }
        }
    }
}
</script>