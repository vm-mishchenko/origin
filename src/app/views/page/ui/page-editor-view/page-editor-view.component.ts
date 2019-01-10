import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventBusService} from '../../../../application/event-bus';
import {SwitchMenuEvent} from '../../../../application/origin/events/switch-menu.event';
import {PageInUrlSelectedEvent} from '../../../../features/page/events/page-in-url-selected.event';
import {PageUiController} from '../../../../features/page/page-ui.controller';
import {PageEditorViewController} from './page-editor-view.controller';

@Component({
    templateUrl: './page-editor-view.component.html',
    styleUrls: ['./page-editor-view.component.scss'],
    providers: [PageEditorViewController]
})
export class PageEditorViewComponent implements OnInit {
    constructor(public pageEditorViewController: PageEditorViewController,
                private route: ActivatedRoute,
                private eventBusService: EventBusService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: { id: string }) => {
            this.pageEditorViewController.onSelectedPageId(params.id);
        });
    }

    showMenu() {
        this.eventBusService.dispatch(new SwitchMenuEvent());
    }
}
