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
        <v-list class="w-4/5 mb-4 overflow-auto">
            <template v-for="(task, index) of tasks">
                <v-list-tile :key="index">
                    {{ task.name }}
                </v-list-tile>
                <v-divider v-if="index !== tasks.length -1" :key="`divider-${index}`" />
            </template>
            <v-list-tile v-if="tasks.length === 0" class="text-grey-darker">
                No tasks
            </v-list-tile>
        </v-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/soukai/models/Task';

interface ComponentData {
    newTask: string;
    tasks: Task[];
}

export default Vue.extend({
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
            Task.all().then(tasks => {
                this.tasks.splice(0, this.tasks.length, ...tasks);
            });
        },
    },
});
</script>
