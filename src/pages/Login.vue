<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl">Focus 省 - Login</h1>
        <v-form class="w-1/2" @submit.prevent="login">
            <div class="flex">
                <v-text-field v-model="url" />
                <v-btn color="primary" @click="login">Login</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface ComponentData {
    url: string;
}

export default Vue.extend({
    data(): ComponentData {
        return {
            url: '',
        };
    },
    methods: {
        login() {
            // TODO show loading
            // TODO handle errors
            this.$auth.login(this.url);
        },
    },
});
</script>
