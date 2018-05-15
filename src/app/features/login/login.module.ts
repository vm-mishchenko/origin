import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {BusyStatusModule} from '../../components/busy-status/busy-status.module';
import {StorageModule} from '../../infrastructure/storage/storage.module';
import {LoginDataStreams} from './login-data-streams.class';
import {LoginSandbox} from './login.sandbox';
import {LoginComponent} from './ui/component/login/login.component';
import {UserInfoComponent} from './ui/component/user-info/user-info.component';
import {LoginPageControllerComponent} from './ui/page-controllers/login-page/login-page-controller.component';

/**
 * @desc
 * Functionality:
 * Allow to sign in / sign out user
 *
 * Get results:
 * Share user information in the global store
 */
@NgModule({
    imports: [
        // app modules
        EventBusModule,
        StorageModule,
        BusyStatusModule,

        CommonModule,
        AngularFireAuthModule,
        NgbModule
    ],
    exports: [
        UserInfoComponent,
        LoginPageControllerComponent
    ],
    providers: [
        LoginSandbox,
        LoginDataStreams
    ],
    declarations: [
        // components
        LoginComponent,
        UserInfoComponent,

        // page controllers
        LoginPageControllerComponent
    ]
})
export class LoginModule {
}
