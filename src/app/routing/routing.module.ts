import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard, LoginPageGuard} from '../application/navigation';
import {HomeComponent, HomeModule, WelcomeComponent} from '../views/home';
import {LoginModule, LoginPageControllerComponent} from '../features/login';
import {PageControllerComponent, PageModule} from '../features/page';

const routes: Routes = [
    {
        path: 'login',
        component: LoginPageControllerComponent,
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
                component: PageControllerComponent
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
        LoginModule,
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
