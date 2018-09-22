<template>
    <v-app>
        <Splash v-if="loading"/>
        <Home v-else-if="$auth.loggedIn" />
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
        };
    },
    mounted() {
        this.$auth
            .init()
            .then(() => {
                this.loading = false;
            });
    },
});
</script>
