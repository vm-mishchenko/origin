import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {BusyStatusModule} from '../../components/busy-status/busy-status.module';
import {LoginServiceModule} from '../login-service';
import {LoginComponent} from './component/login/login.component';
import {UserInfoComponent} from './component/user-info/user-info.component';

@NgModule({
    imports: [
        // app modules
        EventBusModule,
        BusyStatusModule,
        CommonModule,
        NgbModule,
        LoginServiceModule
    ],
    exports: [
        LoginComponent,
        UserInfoComponent
    ],
    declarations: [
        LoginComponent,
        UserInfoComponent
    ]
})
export class LoginUiModule {
}
