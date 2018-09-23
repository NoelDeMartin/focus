import { Observable, BehaviorSubject } from 'rxjs';

import Config from '@/config.json';

import Storage from '@/services/Storage';

import Str from '@/utils/Str';
import Reactive from '@/utils/Reactive';

interface Data {
    accessToken: string | null;
    clientDomain: string | null;
}

class Auth {

    private status: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private data: Data = Reactive.object({
        accessToken: null,
        clientDomain: null,
    });

    public get loggedIn(): boolean {
        return this.data.accessToken !== null;
    }

    public get accessToken(): string {
        return this.data.accessToken as string;
    }

    public get clientDomain(): string {
        return this.data.clientDomain as string;
    }

    public get observable(): Observable<boolean> {
        return this.status.asObservable();
    }

    public async init(): Promise<void> {
        const params = new URL(window.location.href).searchParams;

        if (params.has('code') && params.get('state') === Storage.get('state')) {
            Storage.remove('state');

            await this.exchangeCode(params.get('code') as string);
        } else if (Storage.has('credentials')) {
            const credentials = Storage.get('credentials');

            if (Date.now() < credentials.expires_at) {
                this.data.accessToken = credentials.access_token;
                this.data.clientDomain = Storage.get('client').domain;

                this.status.next(true);
            } else {
                this.requestCode();
            }

        }
    }

    public async login(domain: string): Promise<void> {
        await fetch(domain + '/register', {
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
                    Storage.set('client', {
                        id: response.client_id,
                        domain: domain,
                    });

                    this.requestCode();
                } else {
                    // TODO handle invalid response
                }
            });
    }

    public logout(): void {
        Storage.remove('client');
        Storage.remove('credentials');
        Storage.remove('state');

        this.data.accessToken = null;
        this.data.clientDomain = null;

        this.status.next(false);
    }

    private requestCode(): void {
        const client = Storage.get('client');
        const state = Storage.set('state', Str.random());

        window.location.href =
            client.domain + '/authorize' +
            '?response_type=code' +
            '&client_id=' + client.id +
            '&redirect_uri=' + Config.base_url +
            '&state=' + state;
    }

    private async exchangeCode(code: string): Promise<void> {
        const client = Storage.get('client');
        const params = new FormData();

        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', client.id);
        params.append('redirect_uri', Config.base_url);

        await fetch(client.domain + '/token', {
            method: 'POST',
            body: params,
        })
            .then(res => res.json())
            .then(res => {
                const credentials = {
                    access_token: res.access_token,
                    expires_at: Date.now() + (res.expires_in * 1000),
                };

                Storage.set('credentials', credentials);

                this.data.accessToken = credentials.access_token;
                this.data.clientDomain = client.domain;

                window.history.replaceState({}, document.title, Config.base_url);

                this.status.next(true);
            });
    }

}

export default new Auth();
