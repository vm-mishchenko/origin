import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {
    BrickRegistry,
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
import {FormControlsModule} from '../../components/form-controls';
import {InquireModule} from '../../components/inquire';
import {FirebaseFileUploaderModule} from '../../infrastructure/firebase-file-uploader';
import {FirebaseStorageModule} from '../../infrastructure/firebase-storage';
import {LoggerModule} from '../../infrastructure/logger';
import {StorageModule} from '../../infrastructure/storage';
import {UtilsModule} from '../../infrastructure/utils';
import {LoginServiceModule} from '../login-service';
import {PageRepository} from './domain/page.repository';
import {PageGateway} from './infrastructure/page.gateway';
import {PageBrickComponent} from './page-brick/page-brick.component';
import {PageUiController} from './page-ui.controller';
import {PageController} from './page.controller';
import {PageBreadcrumbComponent} from './ui/components/page-breadcrumb/page-breadcrumb.component';
import {PageEditorComponent} from './ui/components/page-editor/page-editor.component';
import {PageTreeItemComponent} from './ui/components/page-tree/page-tree-item.component';
import {PageTreeComponent} from './ui/components/page-tree/page-tree.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,

        // app modules
        LoginServiceModule,
        EventBusModule,

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

        UtilsModule,
        NavigationModule,
        FirebaseStorageModule,
        FormControlsModule,

        // application modules
        InquireModule,
        LoggerModule,
        StorageModule,
        FirebaseFileUploaderModule
    ],
    declarations: [
        PageTreeComponent,
        PageTreeItemComponent,
        PageEditorComponent,
        PageBrickComponent,
        PageBreadcrumbComponent
    ],
    providers: [
        PageController,
        PageUiController,
        PageRepository,
        PageGateway
    ],
    exports: [
        PageTreeComponent,
        PageTreeItemComponent,
        PageEditorComponent,
        PageBreadcrumbComponent
    ],
    entryComponents: [
        PageBrickComponent
    ]
})
export class PageModule {
    constructor(private brickRegistry: BrickRegistry) {
        this.brickRegistry.register({
            tag: 'page',
            component: PageBrickComponent,
            name: 'Page',
            description: 'Embed a sub-page inside this page'
        });
    }
}
