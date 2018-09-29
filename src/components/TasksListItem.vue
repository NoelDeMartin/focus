<template>
    <v-list-tile>
        <v-checkbox
            :input-value="task.completed"
            :label="task.name"
            :class="{
                'line-through': task.completed
            }"
            @change="toggle"
        />
    </v-list-tile>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/soukai/models/Task';

export default Vue.extend({
    props: {
        task: {
            required: true,
            type: Task,
        },
    },
    methods: {
        toggle() {
            this.task.toggle().catch(error => {
                // TODO handle error
                console.error(error);
            });
        },
    },
});
</script>
