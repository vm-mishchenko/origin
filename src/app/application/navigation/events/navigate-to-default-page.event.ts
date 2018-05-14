import { IEvent } from '../../event-bus';

export class NavigateToDefaultPageEvent implements IEvent {
    type = 'NAVIGATION:TO_DEFAULT_PAGE';

    constructor() {
    }
}
