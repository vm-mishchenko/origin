import {IEvent} from '../../event-bus';

export class NavigateToPageEvent implements IEvent {
    type = 'NAVIGATION:TO_PAGE';

    constructor(public pageId: string) {
    }
}
