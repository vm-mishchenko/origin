import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseOptionsToken} from 'angularfire2';
import {AppComponent} from './app.component';
import {FIREBASE_CONFIG} from './app.config';
import {NavigationModule} from './application/navigation';
import {OriginModule} from './application/origin';
import {LoginModule} from './features/login';
import {PageModule} from './features/page';
import {FirebaseFileUploaderModule} from './infrastructure/firebase-file-uploader';
import {RoutingModule} from './routing';

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
        LoginModule,
        NavigationModule,
        RoutingModule,

        // infrastructure
        FirebaseFileUploaderModule,

        // features
        PageModule
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
