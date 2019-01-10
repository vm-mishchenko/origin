import {OverlayModule} from '@angular/cdk/overlay';
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
import {FirebaseFileUploaderModule} from './infrastructure/firebase-file-uploader';
import {StorageModule} from './infrastructure/storage';
import {RoutingModule} from './routing';

@NgModule({
    imports: [
        // angular
        BrowserModule,
        RouterModule,
        EventBusModule.forRoot(),
        StorageModule.forRoot(),
        NavigationModule.forRoot(),

        // 3d-party
        NgbModule.forRoot(),

        // Application
        OriginModule,
        RoutingModule,
        OverlayModule,

        // infrastructure
        FirebaseFileUploaderModule,

        // features
        LoginServiceModule.forRoot(),
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
