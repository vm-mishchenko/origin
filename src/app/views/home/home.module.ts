import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {NavigationModule} from '../../application/navigation';
import {LoginUiModule} from '../../features/login-ui';
import {PageUiModule} from '../../features/page-ui/page-ui.module';
import {WelcomeComponent} from './ui/components/welcome/welcome.component';
import {HomeComponent} from './ui/page-controlles/home/home.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PageUiModule,
        NavigationModule,
        LoginUiModule,
        EventBusModule
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
