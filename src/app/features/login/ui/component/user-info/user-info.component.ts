import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventBusService } from '../../../../../application/event-bus';
import { StorageService } from '../../../../../infrastructure/storage';
import { LogoutAction } from '../../../actions/logout.action';
import { LoginDataStreams } from '../../../login-data-streams.class';

@Component({
    selector: 'o-user-info',
    templateUrl: './user-info.component.html',
    styles: [`
        :host {
            display: flex;
            align-items: center;
            padding: 0 1rem;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserInfoComponent {
    constructor(public loginDataStreams: LoginDataStreams,
                public storageService: StorageService,
                private eventBusService: EventBusService) {
    }

    onLogout() {
        this.eventBusService.dispatch(new LogoutAction());
    }
}
