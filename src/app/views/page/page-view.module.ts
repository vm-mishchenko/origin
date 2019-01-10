import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PageUiModule} from '../../features/page-ui';
import {PageEditorViewComponent} from './ui/page-editor-view/page-editor-view.component';

@NgModule({
    imports: [
        CommonModule,
        PageUiModule
    ],
    declarations: [
        PageEditorViewComponent
    ],
    providers: [],
    exports: [
        PageEditorViewComponent
    ],
    entryComponents: []
})
export class PageViewModule {
}
