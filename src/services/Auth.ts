import { Str } from '@/utils/Str';
import Config from '@/config.json';
import Storage from '@/services/Storage';

export class Auth {

    // TODO store in Vuex for reactivity
    // TODO add expiration
    private accessToken?: string;

    public async init(): Promise<void> {
        const params = new URL(window.location.href).searchParams;

        if (params.has('code') && params.get('state') === Storage.get('state')) {
            const storeDomain = Storage.get('storeDomain');

            Storage.remove('storeDomain');
            Storage.remove('state');

            await this.exchangeCode(storeDomain, params.get('code') as string);
        } else if (Storage.has('accessToken')) {
            this.accessToken = Storage.get('accessToken');
        }
    }

    public async login(storeDomain: string): Promise<void> {
        await fetch(storeDomain + '/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_name: Config.name,
                client_description: Config.description,
                client_uri: Config.base_url,
                redirect_uris: [
                    Config.base_url,
                ],
                token_endpoint_auth_method: 'none',
                grant_types: ['authorization_code'],
                response_types: ['code'],
                schema: require('@/schema.graphql'),
            }),
        })
            .then(res => res.json())
            .then((response: { redirect?: string, client_id?: string}) => {
                if (response.redirect) { // Why and when??
                    window.location.href = response.redirect;
                } else if (response.client_id) {
                    // TODO store together with store domain and with a custom format
                    Storage.set('client', response);

                    this.requestCode(storeDomain);
                } else {
                    // TODO handle invalid response
                }
            });
    }

    protected requestCode(storeDomain: string): void {
        const client = Storage.get('client');
        const state = Storage.set('state', Str.random());

        Storage.set('storeDomain', storeDomain);

        window.location.href =
            storeDomain + '/authorize' +
                '?response_type=code' +
                '&client_id=' + client.client_id +
                '&redirect_uri=' + Config.base_url +
                '&state=' + state;
    }

    private async exchangeCode(storeDomain: string, code: string): Promise<void> {
        const client = Storage.get('client');
        const params = new FormData();

        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', client.client_id);
        params.append('redirect_uri', Config.base_url);

        await fetch(storeDomain + '/token', {
            method: 'POST',
            body: params,
        })
            .then(res => res.json())
            .then(res => {
                Storage.set('accessToken', res.access_token);

                window.location.href = Config.base_url;
            });
    }

    public get loggedIn(): boolean {
        return !!this.accessToken;
    }

}

export default new Auth();