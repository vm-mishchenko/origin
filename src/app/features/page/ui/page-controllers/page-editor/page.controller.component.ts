import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventBusService} from '../../../../../application/event-bus';
import {SwitchMenuEvent} from '../../../../../application/origin/events/switch-menu.event';
import {PageInUrlSelectedEvent} from '../../../events/page-in-url-selected.event';
import {PageUiController} from '../../../page-ui.controller';

@Component({
    templateUrl: './page.controller.component.html',
    styleUrls: ['./page.controller.component.scss']
})
export class PageControllerComponent implements OnInit {
    constructor(public pageUiController: PageUiController,
                private route: ActivatedRoute,
                private eventBusService: EventBusService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: { id: string }) => {
            this.eventBusService.dispatch(new PageInUrlSelectedEvent(params.id));
        });
    }

    showMenu() {
        this.eventBusService.dispatch(new SwitchMenuEvent());
    }
}
