import { IEvent } from '../../../application/event-bus';

export class LoginAction implements IEvent {
    readonly type = 'LOGIN_ACTION';

    constructor(public isGuest: boolean = false) {
    }
}
