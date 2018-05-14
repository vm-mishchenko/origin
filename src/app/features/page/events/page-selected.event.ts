import { IEvent } from '../../../application/event-bus';

export class PageSelectedEvent implements IEvent {
    type = 'PAGE:PAGE_SELECTED';

    constructor(public pageId: string) {
    }
}
