import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageInUrlSelectedEvent} from '../../features/page-service/events/page-in-url-selected.event';
import {EventBusService} from '../event-bus';
import {SwitchMenuEvent} from './events/switch-menu.event';

@Injectable()
export class OriginUiController {
    isMenuOpen$: Observable<boolean> = new BehaviorSubject(false);

    constructor(private eventBusService: EventBusService) {
        this.eventBusService.actions$.subscribe((action) => {
            if (action instanceof SwitchMenuEvent) {
                this.switchMenu();
            }

            if (action instanceof PageInUrlSelectedEvent) {
                if ((this.isMenuOpen$ as BehaviorSubject<boolean>).value) {
                    this.switchMenu();
                }
            }
        });
    }

    switchMenu() {
        const currentValue = (this.isMenuOpen$ as BehaviorSubject<boolean>).value;

        (this.isMenuOpen$ as BehaviorSubject<boolean>).next(!currentValue);
    }
}
