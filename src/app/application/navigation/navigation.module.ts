import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginServiceModule} from '../../features/login-service';
import {LoggerModule} from '../../infrastructure/logger';
import {StorageModule} from '../../infrastructure/storage/storage.module';
import {EventBusModule} from '../event-bus/event-bus.module';
import {AuthGuard} from './guards/auth.guard';
import {LoginPageGuard} from './guards/login-page.guard';
import {NavigationService} from './navigation.service';

@NgModule({
    imports: [
        LoginServiceModule,
        LoggerModule,
        RouterModule,
        EventBusModule,
        StorageModule
    ]
})
export class NavigationModule {
    constructor(navigationService: NavigationService) {
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NavigationModule,
            providers: [
                AuthGuard,
                LoginPageGuard,
                NavigationService
            ]
        };
    }
}
