import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard, LoginPageGuard} from '../application/navigation';
import {HomeComponent, HomeModule, WelcomeComponent} from '../views/home';
import {LoginUiModule} from '../features/login-ui';
import {PageModule} from '../features/page';
import {LoginViewComponent} from '../views/login/containers/login-view/login-view.component';
import {LoginViewModule} from '../views/login/login-view.module';
import {PageEditorViewComponent} from '../views/page';

const routes: Routes = [
    {
        path: 'login',
        component: LoginViewComponent,
        canActivate: [
            LoginPageGuard
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: HomeComponent,
        children: [
            {
                path: '',
                component: WelcomeComponent
            },
            {
                path: 'page/:id',
                component: PageEditorViewComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        LoginViewModule,
        HomeModule,
        PageModule,
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {
}
