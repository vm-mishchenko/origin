import {IWallDefinition} from 'ngx-wall';
import {IEvent} from '../../../application/event-bus';

export class UpdatePageContentEvent implements IEvent {
    type = 'PAGE:UPDATE_PAGE_CONTENT';

    constructor(public pageId: string, public content: { title?: string, body?: IWallDefinition }) {
    }
}
