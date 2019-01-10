import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {LoginDataStreams} from '../../../features/login-service';
import {NavigationService} from '../navigation.service';

@Injectable()
export class LoginPageGuard implements CanActivate {
    constructor(private loginDataStreams: LoginDataStreams,
                private navigationService: NavigationService) {
    }

    canActivate() {
        return this.loginDataStreams.user$.pipe(
            filter((user) => {
                return user !== undefined;
            }),
            map((user) => {
                if (user) {
                    this.navigationService.toDefaultPage();
                }

                return !user;
            })
        );
    }
}
