import { Component, OnInit } from '@angular/core';
import { EventBusService } from '../../../../../application/event-bus';
import { SwitchMenuEvent } from '../../../../../application/origin';

@Component({
    selector: 'o-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {
    constructor(private eventBusService: EventBusService) {
    }

    ngOnInit() {
    }

    showMenu() {
        this.eventBusService.dispatch(new SwitchMenuEvent());
    }
}
