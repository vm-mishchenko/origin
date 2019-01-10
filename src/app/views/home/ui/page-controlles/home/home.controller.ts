import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class HomeController {
    selectedPageId$: Observable<string> = new BehaviorSubject(null);

    constructor() {
    }

    onSelectedPageId(pageId: string) {
        (this.selectedPageId$ as BehaviorSubject<string>).next(pageId);
    }
}
