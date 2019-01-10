import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {StorageModule} from '../../infrastructure/storage';
import {LoginDataStreams} from './login-data-streams.class';
import {LoginSandbox} from './login.sandbox';

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
        AngularFireAuthModule,
    ],
    declarations: [],
    providers: [
        LoginSandbox,
        LoginDataStreams
    ],
})
export class LoginServiceModule {
}
