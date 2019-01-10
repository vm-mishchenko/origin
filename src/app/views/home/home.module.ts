import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {NavigationModule} from '../../application/navigation';
import {LoginUiModule} from '../../features/login-ui';
import {PageModule} from '../../features/page/page.module';
import {WelcomeComponent} from './ui/components/welcome/welcome.component';
import {HomeComponent} from './ui/page-controlles/home/home.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PageModule,
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
