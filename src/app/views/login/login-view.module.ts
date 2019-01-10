import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageGuard} from '../../application/navigation';
import {LoginUiModule} from '../../features/login-ui';
import {LoginViewComponent} from './containers/login-view/login-view.component';

const routes: Routes = [
    {
        path: '',
        component: LoginViewComponent,
        canActivate: [
            LoginPageGuard
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        LoginUiModule,
        RouterModule.forChild(routes),
    ],
    declarations: [LoginViewComponent],
    exports: [LoginViewComponent, RouterModule]
})
export class LoginViewModule {
}
