<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <div class="fixed pin-r pin-t m-4">
            <a @click="$auth.logout()">Logout</a>
        </div>
        <h1 class="text-4xl">Focus 省</h1>
        <v-form class="w-4/5" @submit.prevent="createTask">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="createTask">Add</v-btn>
            </div>
        </v-form>
        <TasksList :tasks="tasks" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/soukai/models/Task';

import TasksList from '@/components/TasksList.vue';

interface ComponentData {
    newTask: string;
    tasks: Task[];
}

export default Vue.extend({
    components: {
        TasksList,
    },
    data(): ComponentData {
        return {
            newTask: '',
            tasks: [],
        };
    },
    created() {
        this.updateTasks();
    },
    methods: {
        createTask() {
            if (this.newTask) {
                // TODO show loading
                Task.create({ name: this.newTask })
                    .then(() => {
                        this.newTask = '';

                        // TODO use subscriptions instead
                        this.updateTasks();
                    });
            }
        },
        updateTasks() {
            Task.all<Task>().then(tasks => {
                this.tasks.splice(0, this.tasks.length, ...tasks);
            });
        },
    },
});
</script>
