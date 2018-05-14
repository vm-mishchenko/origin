import { IEvent } from '../../../application/event-bus';

export class DeletePageEvent implements IEvent {
    type = 'PAGE:DELETE_PAGE';

    constructor(public pageId: string) {
    }
}
