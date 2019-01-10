import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../application/navigation';
import {PageUiModule} from '../features/page-ui';
import {HomeComponent, HomeModule, WelcomeComponent} from '../views/home';
import {PageEditorViewComponent} from '../views/page';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: '../views/login/login-view.module#LoginViewModule'
        /*component: LoginViewComponent,
        canActivate: [
            LoginPageGuard
        ]*/
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
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
/*    {
        path: '**',
        redirectTo: ''
    }*/
];

@NgModule({
    imports: [
        HomeModule,
        PageUiModule,
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule {
}
