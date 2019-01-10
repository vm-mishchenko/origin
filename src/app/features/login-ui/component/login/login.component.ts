import {Component} from '@angular/core';
import {EventBusService} from '../../../../application/event-bus';
import {LoginAction} from '../../../login-service';

@Component({
    selector: 'o-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    constructor(private eventBusService: EventBusService) {
    }

    onLogin() {
        this.eventBusService.dispatch(new LoginAction());
    }

    onLoginAsGuest() {
        this.eventBusService.dispatch(new LoginAction(true));
    }
}
