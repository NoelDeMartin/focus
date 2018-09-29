<template>
    <v-list class="w-4/5 mb-4 overflow-auto">
        <template v-for="(task, index) of sortedTasks">
            <TasksListItem :task="task" :key="task.id"/>
            <v-divider v-if="index !== tasks.length -1" :key="`divider-${index}`" />
        </template>
        <v-list-tile v-if="tasks.length === 0" class="text-grey-darker">
            No tasks
        </v-list-tile>
    </v-list>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/soukai/models/Task';

import TasksListItem from '@/components/TasksListItem.vue';

export default Vue.extend({
    components: {
        TasksListItem,
    },
    props: {
        tasks: {
            required: true,
            type: Array,
        },
    },
    computed: {
        sortedTasks() {
            return (this.tasks as Task[])
                .sort((a, b) => {
                    if (a.created_at > b.created_at) {
                        return 1;
                    } else if (a.created_at < b.created_at) {
                        return -1;
                    } else {
                        return 0;
                    }
                })
                .sort((a, b) => {
                    if (a.completed && !b.completed) {
                        return 1;
                    } else if (!a.completed && b.completed) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
        },
    },
});
</script>
