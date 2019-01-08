import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PageModule} from '../../features/page';
import {PageEditorViewComponent} from './ui/page-editor-view/page-editor-view.component';

@NgModule({
    imports: [
        CommonModule,
        PageModule
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
