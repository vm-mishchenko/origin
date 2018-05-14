import { IEvent } from '../../../application/event-bus';

export class MoveBricksToPageEvent implements IEvent {
    type = 'PAGE:MOVE_BRICKS_TO_PAGE';

    constructor(public sourcePagedId: string, public movedBrickIds: string[], public targetPageId: string) {
    }
}
