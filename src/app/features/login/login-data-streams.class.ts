import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IUserData} from './domain/user-data.interface';
import {LoginSandbox} from './login.sandbox';

@Injectable()
export class LoginDataStreams {
    user$: Observable<IUserData>;

    constructor(private loginSandbox: LoginSandbox) {
        const user$ = this.loginSandbox.currentUser$
            .map((user) => {
                // todo: I know it's ugly, in free time organize better
                if (user) {
                    return user.toJSON();
                } else if (user === null) {
                    return null;
                } else if (user === undefined) {
                    return undefined;
                }
            })
            .publishReplay(1);

        user$.connect();

        this.user$ = user$;
    }
}
