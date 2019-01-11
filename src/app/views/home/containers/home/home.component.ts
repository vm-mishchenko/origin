import {Component, HostBinding} from '@angular/core';
import {EventBusService} from '../../../../application/event-bus';
import {NavigateToPageEvent} from '../../../../application/navigation';
import {AddPageEvent} from '../../../../features/page-service';
import {HomeController} from './home.controller';

@Component({
    selector: 'o-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeController]
})
export class HomeComponent {
    @HostBinding('class.opened__menu') showMenu = false;

    constructor(private eventBusService: EventBusService,
                public homeController: HomeController) {
        this.homeController.isMenuOpen$.subscribe((isMenuOpen) => {
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
