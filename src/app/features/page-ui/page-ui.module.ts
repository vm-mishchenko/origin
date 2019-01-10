import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {FormControlsModule} from '../../components/form-controls';
import {InquireModule} from '../../components/inquire';
import {UtilsModule} from '../../infrastructure/utils';
import {PageServiceModule} from '../page-service/page-service.module';
import {PageBrickComponent} from './page-brick/page-brick.component';
import {PageBreadcrumbComponent} from './ui/components/page-breadcrumb/page-breadcrumb.component';
import {PageEditorComponent} from './ui/components/page-editor/page-editor.component';
import {PageTreeItemComponent} from './ui/components/page-tree/page-tree-item.component';
import {PageTreeComponent} from './ui/components/page-tree/page-tree.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        PageServiceModule,
        UtilsModule,
        FormControlsModule,
        InquireModule,

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
    declarations: [
        PageTreeComponent,
        PageTreeItemComponent,
        PageEditorComponent,
        PageBrickComponent,
        PageBreadcrumbComponent
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
export class PageUiModule {
    constructor(private brickRegistry: BrickRegistry) {
        this.brickRegistry.register({
            tag: 'page',
            component: PageBrickComponent,
            name: 'Page',
            description: 'Embed a sub-page inside this page'
        });
    }
}
