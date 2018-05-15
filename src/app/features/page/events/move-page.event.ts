import {IEvent} from '../../../application/event-bus';

export class MovePageEvent implements IEvent {
    type = 'PAGE:MOVE_PAGE';

    constructor(public movedPageId: string, public targetPageId: string = null) {
    }
}
