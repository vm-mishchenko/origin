import {IEvent} from '../../../application/event-bus';

export class LoadPageEvent implements IEvent {
    type = 'PAGE:LOAD_PAGE';

    constructor(public pageId: string) {
    }
}
