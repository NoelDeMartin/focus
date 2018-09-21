<template>
    <v-app>
        <Splash v-if="loading"/>
        <Home v-else-if="loggedIn" />
        <Login v-else />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Splash from '@/components/Splash.vue';

export default Vue.extend({
    components: {
        Home,
        Login,
        Splash,
    },
    data() {
        return {
            loading: true,

            // TODO replace with vuex
            loggedIn: false,
        };
    },
    mounted() {
        this.$auth
            .init()
            .then(() => {
                this.loggedIn = this.$auth.loggedIn;
                this.loading = false;
            });
    },
});
</script>
