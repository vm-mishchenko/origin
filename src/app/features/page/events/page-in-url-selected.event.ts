import { IEvent } from '../../../application/event-bus';

export class PageInUrlSelectedEvent implements IEvent {
    type = 'PAGE:PAGE_IN_URL_SELECTED';

    constructor(public pageId: string) {
    }
}
