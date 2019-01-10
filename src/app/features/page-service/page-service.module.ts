import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    CodeBrickModule,
    DividerBrickModule,
    HeaderBrickModule,
    ImgBrickModule,
    PickOutModule,
    QuoteBrickModule,
    RadarModule,
    TextBrickModule,
    TowModule,
    VideoBrickModule,
    WallModule,
    WebBookmarkBrickModule
} from 'ngx-wall';
import {EventBusModule} from '../../application/event-bus/event-bus.module';
import {NavigationModule} from '../../application/navigation';
import {FirebaseFileUploaderModule} from '../../infrastructure/firebase-file-uploader';
import {FirebaseStorageModule} from '../../infrastructure/firebase-storage';
import {LoggerModule} from '../../infrastructure/logger';
import {StorageModule} from '../../infrastructure/storage';
import {UtilsModule} from '../../infrastructure/utils';
import {LoginServiceModule} from '../login-service';
import {PageUiController} from '../page/page-ui.controller';
import {PageRepository} from './domain/page.repository';
import {PageGateway} from './infrastructure/page.gateway';
import {PageController} from './page.controller';

@NgModule({
    imports: [
        CommonModule,

        // app modules
        LoginServiceModule,
        EventBusModule,

        LoggerModule,
        StorageModule,
        FirebaseFileUploaderModule,
        FirebaseStorageModule,
        NavigationModule,
        UtilsModule,

        // wall module
        WallModule,
        QuoteBrickModule,
        TextBrickModule,
        DividerBrickModule,
        VideoBrickModule,
        HeaderBrickModule,
        ImgBrickModule,
        CodeBrickModule,
        WebBookmarkBrickModule,
        PickOutModule,
        TowModule,
        RadarModule,
        WebBookmarkBrickModule,
    ],
    providers: [
        PageController,
        PageUiController,
        PageRepository,
        PageGateway
    ],
    declarations: []
})
export class PageServiceModule {
}
