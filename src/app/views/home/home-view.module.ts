import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {AuthGuard, NavigationModule} from '../../application/navigation';
import {LoginUiModule} from '../../features/login-ui';
import {PageUiModule} from '../../features/page-ui/page-ui.module';
import {PageEditorViewComponent, PageViewModule} from '../page';
import {WelcomeComponent} from './containers/welcome/welcome.component';
import {HomeViewComponent} from './containers/home-view/home-view.component';

const routes: Routes = [
    {
        path: '',
        component: HomeViewComponent,
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
        HomeViewComponent,
        WelcomeComponent
    ],
    exports: [
        HomeViewComponent,
        WelcomeComponent
    ]
})
export class HomeViewModule {
}
