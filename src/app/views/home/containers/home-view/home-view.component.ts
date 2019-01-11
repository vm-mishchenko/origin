import {Component, HostBinding} from '@angular/core';
import {EventBusService} from '../../../../application/event-bus';
import {NavigateToPageEvent} from '../../../../application/navigation';
import {AddPageEvent} from '../../../../features/page-service';
import {HomeViewController} from './home-view.controller';

@Component({
    selector: 'o-home',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss'],
    providers: [HomeViewController]
})
export class HomeViewComponent {
    @HostBinding('class.opened__menu') showMenu = false;

    constructor(private eventBusService: EventBusService,
                public homeController: HomeViewController) {
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
