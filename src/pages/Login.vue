<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl">Focus 省 - Login</h1>
        <v-btn color="primary" @click="login">Login</v-btn>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    methods: {
        login() {
            // TODO show loading
            // TODO handle errors
            this.$auth.login();
        },
    },
});
</script>
