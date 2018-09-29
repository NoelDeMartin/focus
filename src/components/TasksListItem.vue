<template>
    <v-list-tile class="task-list-item">
        <v-checkbox
            :input-value="task.completed"
            :label="task.name"
            :class="{
                'completed': task.completed
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

<style lang="scss">
    .task-list-item .completed label {
        @apply .line-through;
    }
</style>
