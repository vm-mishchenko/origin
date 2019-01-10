import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseOptionsToken} from 'angularfire2';
import {AppComponent} from './app.component';
import {FIREBASE_CONFIG} from './app.config';
import {NavigationModule} from './application/navigation';
import {OriginModule} from './application/origin';
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

        // 3d-party
        NgbModule.forRoot(),
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
