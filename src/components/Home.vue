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
        <v-list class="w-4/5">
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

import gql from 'graphql-tag';
import ApolloClient, { ObservableQuery } from 'apollo-boost';

interface ComponentData {
    newTask: string;
    tasks: string[];
    client: ApolloClient<any>;
    tasksQuery: ObservableQuery<any>;
}

export default Vue.extend({
    data(): ComponentData {
        return {
            newTask: '',
            tasks: [],
            client: null as any,
            tasksQuery: null as any,
        };
    },
    created() {
        this.client = new ApolloClient({
            uri: this.$auth.clientDomain,
            headers: {
                Authorization: 'Bearer ' + this.$auth.accessToken,
            },
        });

        this.tasksQuery = this.client.watchQuery({
            query: gql`{tasks:getTasks{id,name,author_id,created_at,updated_at,completed_at}}`,
        });

        this.tasksQuery.subscribe(result => {
            this.tasks.splice(0, this.tasks.length, ...result.data.tasks);
        });
    },
    methods: {
        createTask() {
            if (this.newTask) {
                // TODO show loading
                this.client
                    .mutate({
                        mutation: gql`mutation ($name: String!) {
                            createTask(name: $name) { id }
                        }`,
                        variables: {
                            name: this.newTask,
                        },
                    })
                    .then(() => {
                        this.newTask = '';

                        // TODO use subscriptions instead
                        this.tasksQuery.refetch();
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }
        },
    },
});
</script>
