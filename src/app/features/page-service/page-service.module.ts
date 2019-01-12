import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {WallModule} from 'ngx-wall';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {NavigationModule} from '../../application/navigation';
import {FirebaseFileUploaderModule} from '../../infrastructure/firebase-file-uploader';
import {FirebaseStorageModule} from '../../infrastructure/firebase-storage';
import {LoggerModule} from '../../infrastructure/logger';
import {StorageModule} from '../../infrastructure/storage';
import {UtilsModule} from '../../infrastructure/utils';
import {LoginServiceModule} from '../login-service';
import {PageRepository} from './domain/page.repository';
import {PageGateway} from './infrastructure/page.gateway';
import {PageUiController} from './page-ui.controller';
import {PageController} from './page.controller';

@NgModule({
    imports: [
        CommonModule,
        LoginServiceModule,
        EventBusModule,
        LoggerModule,
        StorageModule,
        FirebaseFileUploaderModule,
        FirebaseStorageModule,
        NavigationModule,
        UtilsModule,
        WallModule,
    ],
    providers: [
        PageController,
        PageUiController,
        PageRepository,
        PageGateway
    ]
})
export class PageServiceModule {
}
