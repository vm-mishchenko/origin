import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginUiModule} from '../../features/login-ui';
import {LoginViewComponent} from './containers/login-view/login-view.component';

@NgModule({
    imports: [
        CommonModule,
        LoginUiModule
    ],
    declarations: [LoginViewComponent],
    exports: [LoginViewComponent]
})
export class LoginViewModule {
}
