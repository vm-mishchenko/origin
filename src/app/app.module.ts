import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseOptionsToken} from 'angularfire2';
import {AppComponent} from './app.component';
import {FIREBASE_CONFIG} from './app.config';
import {EventBusModule} from './application/event-bus/event-bus.module';
import {NavigationModule} from './application/navigation';
import {OriginModule} from './application/origin';
import {LoginServiceModule} from './features/login-service';
import {LoginUiModule} from './features/login-ui';
import {PageModule} from './features/page';
import {FirebaseFileUploaderModule} from './infrastructure/firebase-file-uploader';
import {RoutingModule} from './routing';
import {PageViewModule} from './views/page';

@NgModule({
    imports: [
        // angular
        BrowserModule,
        RouterModule,
        EventBusModule.forRoot(),

        // 3d-party
        NgbModule.forRoot(),

        // Application
        OriginModule,
        LoginUiModule,
        NavigationModule,
        RoutingModule,

        // infrastructure
        FirebaseFileUploaderModule,

        // features
        PageModule,
        LoginServiceModule.forRoot(),

        // views
        PageViewModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {provide: FirebaseOptionsToken, useValue: FIREBASE_CONFIG}
    ]
})
export class AppModule {
}
