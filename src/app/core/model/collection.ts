import {Observable, Subject} from 'rxjs';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Model} from './model';

export class Collection<T extends Model<any>> {
    states$: Observable<any[]>;

    events$: Observable<{
        actionName: string,
        data?: any
    }> = new Subject();

    private models: T[] = [];

    constructor() {
        const states$ = this.events$
            .filter((action) => action.actionName === 'all')
            .map(() => this.models.map((model) => model.toJSON()))
            .publishReplay(1);

        states$.connect();

        this.states$ = states$;

        this.triggerEvent('initialized');
    }

    add(model: T) {
        this._addReference(model);

        this.models.push(model);

        this.triggerEvent('add', model);
        this.triggerEvent('change');
    }

    map(predicate: (model: T) => any) {
        return this.models.map(predicate);
    }

    find(predicate: (model: T, index: number, models: T[]) => boolean): T {
        return this.models.find(predicate);
    }

    remove(predicate: (model: T, index: number, models: T[]) => boolean): T {
        const pageIndex = this.models.findIndex(predicate);

        if (pageIndex !== -1) {
            const removedModel = this.models.splice(pageIndex, 1)[0];

            this.triggerEvent('remove', removedModel);

            return removedModel;
        } else {
            return null;
        }
    }

    clear() {
        this.models = [];

        this.triggerEvent('change');
    }

    private _addReference(model: T) {
        model.events$.subscribe(this._onModelEvent.bind(this));

        model.state$.subscribe(this._onModelStateChange.bind(this));
    }

    private _onModelEvent(event) {
        this.triggerEvent.apply(this, arguments);
    }

    private _onModelStateChange(newState) {
        // do something
    }

    private triggerEvent(actionName: string, data?: any) {
        (this.events$ as Subject<any>).next({actionName, data});
        (this.events$ as Subject<any>).next({actionName: 'all'});
    }
}
