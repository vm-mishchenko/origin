import {IEvent} from '../../../application/event-bus';

export class AddPageEvent implements IEvent {
    type = 'PAGE:ADD_PAGE';

    metadata: any;
    pageId: string;
    parentPageId: string;

    constructor() {
    }
}
