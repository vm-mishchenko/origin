import { IEvent } from '../../../application/event-bus';

export class SelectedBricksEvent implements IEvent {
    type = 'PAGE:SELECTED_BRICKS';

    constructor(public selectedBrickIds: string[]) {
    }
}
