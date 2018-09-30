import { Observable, BehaviorSubject } from 'rxjs';
import SolidAuthClient from 'solid-auth-client';

import Reactive from '@/utils/Reactive';

interface Data {
    webId: string | null;
    idp: string | null;
}

class Auth {

    private status: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private data: Data = Reactive.object({
        webId: null,
        idp: null,
    });

    public get loggedIn(): boolean {
        return this.data.webId !== null;
    }

    public get webId(): string {
        return this.data.webId as string;
    }

    public get idp(): string {
        return this.data.idp as string;
    }

    public get observable(): Observable<boolean> {
        return this.status.asObservable();
    }

    public async init(): Promise<void> {
        return SolidAuthClient.trackSession(session => {
            if (session) {
                this.data.webId = session.webId;
                this.data.idp = session.idp;
                this.status.next(true);
            } else {
                this.data.webId = null;
                this.data.idp = null;
                this.status.next(false);
            }
        });
    }

    public async login(): Promise<void> {
        const session = await SolidAuthClient.currentSession();

        if (!session) {
            // TODO should be await SolidAuthClient.login(idp);
            await SolidAuthClient.popupLogin({ popupUri: 'https://solid.community/common/popup.html' });
        }
    }

    public async logout(): Promise<void> {
        await SolidAuthClient.logout();
    }

}

export default new Auth();
