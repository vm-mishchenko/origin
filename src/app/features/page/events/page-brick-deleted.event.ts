import { IEvent } from '../../../application/event-bus';

export class PageBrickDeletedEvent implements IEvent {
    type = 'PAGE:PAGE_BRICK_DELETED';

    constructor(public pageId: string) {
    }
}
