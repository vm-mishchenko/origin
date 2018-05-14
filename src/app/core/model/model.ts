import {Observable, Subject} from 'rxjs';

export class Model<State> {
    events$: Observable<any> = new Subject();

    state$: Observable<State> = new Subject();

    set state(data: State) {
        this.innerState = data;

        this.triggerEvent('change');

        (this.state$ as Subject<State>).next(this.innerState);
    }

    get state(): State {
        return this.innerState;
    }

    private innerState: State;

    constructor(state: any) {
        this.state = state;
    }

    toJSON() {
        return this.state;
    }

    private triggerEvent(actionName: string, data?: any) {
        (this.events$ as Subject<any>).next({
            actionName,
            data
        });
    }
}
