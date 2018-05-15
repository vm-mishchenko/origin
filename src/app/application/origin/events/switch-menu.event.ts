import {IEvent} from '../../../application/event-bus';

export class SwitchMenuEvent implements IEvent {
    type = 'ORIGIN:OPEN_MENU';
}
