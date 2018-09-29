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
            const name = Str.capitalize(Str.singular(model.collection));
            const mutationArguments = buildMutationArguments(model, attributes);

            return client
                .mutate({
                    mutation: gql`mutation (${mutationArguments.typed}) {
                        create${name}(${mutationArguments.object}) { id }
                    }`,
                    variables: mutationArguments.attributes,
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
            const name = Str.capitalize(Str.plural(model.collection));

            return client
                .query({
                    query: gql`{
                        models: get${name}{
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
        return this.withClient(client => {
            const attributes: any = Object.assign({}, dirtyAttributes);
            attributes[model.primaryKey] = id;
            for (const field of removedAttributes) {
                attributes[field] = null;
            }

            const name = Str.capitalize(Str.singular(model.modelName));
            const mutationArguments = buildMutationArguments(model, attributes);

            return client
                .mutate({
                    mutation: gql`mutation (${mutationArguments.typed}) {
                        update${name}(${mutationArguments.object}) { id }
                    }`,
                    variables: mutationArguments.attributes,
                })
                .then(res => this.graphQLResult(res))
                .then(res => res.id);
        });
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

function buildMutationArguments(model: typeof Model, attributes: any): {
    typed: string,
    object: string,
    attributes: any,
} {
    const mutationArguments: { [key: string]: string | null } = {};
    const emptyArguments = [];
    for (const field of Object.keys(model.fields)) {
        if (field in attributes) {
            if (attributes[field] === null) {
                delete attributes[field];
                emptyArguments.push(field);
            } else {
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
    }

    return {
        typed: Object.keys(mutationArguments)
            .filter(value => value !== null)
            .map(key => `$${key}: ${mutationArguments[key]}!`)
            .join(', '),
        object: Object.keys(mutationArguments)
            .map((key, value) => value !== null ? `${key}: $${key}` : `${key}: null`)
            .concat(emptyArguments.map(field => `${field}: null`))
            .join(', '),
        attributes,
    };
}
