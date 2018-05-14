import { IEvent } from '../../../application/event-bus';

export class LogoutAction implements IEvent {
    readonly type = 'LOGOUT_ACTION';
}
