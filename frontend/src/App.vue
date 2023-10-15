<template>
    <router-view />
</template>

<script>
import { useAppStore } from '@/store/app'

export default {
    name: 'App',
    setup() {
        const appStore = useAppStore()

        return {
            appStore
        }
    },
    created() {
        if (window.localStorage.getItem("plantifyUserInfo") == null) {
            this.$router.push({ path: '/account/login' })
        } else {
            const storedUser = window.localStorage.getItem("plantifyUserInfo");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                Object.assign(this, parsedUser);
                this.$router.push({ path: '/dashboard' })
            }
        }
    }
}
</script>

<style>

</style>
