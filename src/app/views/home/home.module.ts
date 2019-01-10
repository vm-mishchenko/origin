import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {AuthGuard, NavigationModule} from '../../application/navigation';
import {LoginUiModule} from '../../features/login-ui';
import {PageUiModule} from '../../features/page-ui/page-ui.module';
import {PageEditorViewComponent, PageViewModule} from '../page';
import {WelcomeComponent} from './ui/components/welcome/welcome.component';
import {HomeComponent} from './ui/page-controlles/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
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
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PageUiModule,
        PageViewModule,
        NavigationModule,
        LoginUiModule,
        EventBusModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        HomeComponent,
        WelcomeComponent
    ],
    exports: [
        HomeComponent,
        WelcomeComponent
    ]
})
export class HomeModule {
}
