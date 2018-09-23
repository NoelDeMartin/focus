import { Engine, Model, Database, FieldType } from 'soukai';
import ApolloClient, { FetchResult } from 'apollo-boost';
import gql from 'graphql-tag';

import Auth from '@/services/Auth';
import Str from '@/utils/Str';

export default class implements Engine {

    private client: ApolloClient<any> | null = null;

    constructor() {
        Auth.observable.subscribe(loggedIn => {
            if (loggedIn) {
                this.client = new ApolloClient({
                    uri: Auth.clientDomain,
                    headers: {
                        Authorization: 'Bearer ' + Auth.accessToken,
                    },
                });
            } else {
                this.client = null;
            }
        });
    }

    public create(model: typeof Model, attributes: Database.Attributes): Promise<Database.Key> {
        return this.withClient(client => {
            const name = model.modelName;

            const mutationArguments: { [key: string]: string } = {};
            for (const field in model.fields) {
                if (field in attributes) {
                    switch (model.fields[field].type) {
                        case FieldType.Number:
                            mutationArguments[field] = 'Float';
                            break;
                        case FieldType.String:
                            mutationArguments[field] = 'String';
                            break;
                        case FieldType.Boolean:
                            mutationArguments[field] = 'Boolean';
                            break;
                        case FieldType.Array:
                            // TODO
                            break;
                        case FieldType.Object:
                            // TODO
                            break;
                        case FieldType.Date:
                            mutationArguments[field] = 'Date';
                            break;
                        case FieldType.Key:
                            mutationArguments[field] = 'ID';
                            break;
                    }
                }
            }

            const typedArguments = Object.keys(mutationArguments)
                .map(key => `$${key}: ${mutationArguments[key]}!`)
                .join(', ');

            const functionArguments = Object.keys(mutationArguments)
                .map(key => `${key}: $${key}`)
                .join(', ');

            return client
                .mutate({
                    mutation: gql`mutation (${typedArguments}) {
                        create${name}(${functionArguments}) { id }
                    }`,
                    variables: attributes,
                })
                .then(res => this.graphQLResult(res))
                .then(res => res.id);
        });
    }

    public readOne(model: typeof Model, id: Database.Key): Promise<Database.Document> {
        // TODO

        return Promise.resolve({} as any);
    }

    public readMany(model: typeof Model): Promise<Database.Document[]> {
        return this.withClient(client => {
            const name = model.modelName;
            const pluralName = Str.plural(name);

            return client
                .query({
                    query: gql`{
                        models: get${pluralName}{
                            ${Object.keys(model.fields).join(',')}
                        }
                    }`,
                    fetchPolicy: 'no-cache',
                })
                .then(res => this.graphQLResult(res))
                .then(res => res.models);
        });
    }

    public update(
        model: typeof Model,
        id: Database.Key,
        dirtyAttributes: Database.Attributes,
        removedAttributes: string[],
    ): Promise<void> {
        // TODO

        return Promise.resolve();
    }

    public delete(model: typeof Model, id: Database.Key): Promise<void> {
        // TODO

        return Promise.resolve();
    }

    private graphQLResult(result: FetchResult): any {
        return result.data;
    }

    private withClient<T>(callback: (client: ApolloClient<any>) => T): T {
        if (this.client) {
            return callback(this.client);
        } else {
            throw new Error('Client authorization not initialized');
        }
    }

}
