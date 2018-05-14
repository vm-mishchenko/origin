import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginDataStreams } from '../../../features/login';
import { NavigationService } from '../navigation.service';

@Injectable()
export class LoginPageGuard implements CanActivate {
    constructor(private loginDataStreams: LoginDataStreams,
                private navigationService: NavigationService) {
    }

    canActivate() {
        return this.loginDataStreams.user$
            .filter((user) => user !== undefined)
            .map((user) => {
                if (user) {
                    this.navigationService.toDefaultPage();
                }

                return !user;
            });
    }
}
