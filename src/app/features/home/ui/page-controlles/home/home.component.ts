import {Component, HostBinding} from '@angular/core';
import {Observable} from 'rxjs';
import {EventBusService} from '../../../../../application/event-bus';
import {NavigateToPageEvent} from '../../../../../application/navigation';
import {OriginUiController} from '../../../../../application/origin';
import {AddPageEvent} from '../../../../page';

@Component({
    selector: 'o-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    @HostBinding('class.opened__menu') showMenu = false;

    constructor(private eventBusService: EventBusService,
                private originUiController: OriginUiController) {
        this.originUiController.isMenuOpen$.subscribe((isMenuOpen) => {
            setTimeout(() => {
                this.showMenu = isMenuOpen;
            }, 0);
        });
    }

    onSelectedPage(id: string) {
        this.eventBusService.dispatch(new NavigateToPageEvent(id));
    }

    onAddPage() {
        this.eventBusService.dispatch(new AddPageEvent());
    }
}
