import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {LoginDataStreams} from '../../../features/login';
import {NavigationService} from '../navigation.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private loginDataStreams: LoginDataStreams,
                private navigationService: NavigationService) {
    }

    canActivate() {
        return this.canActivateRoute();
    }

    canActivateChild() {
        return this.canActivateRoute();
    }

    private canActivateRoute() {
        return this.loginDataStreams.user$.pipe(
            filter((user) => user !== undefined),
            map((user) => {
                if (!user) {
                    this.navigationService.toLoginPage();
                }

                return Boolean(user);
            })
        );
    }
}
