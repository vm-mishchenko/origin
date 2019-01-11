import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class HomeViewApiService {
    isMenuOpen$: Observable<boolean> = new BehaviorSubject(false);
    selectedPageId$: Observable<string> = new BehaviorSubject(null);

    switchMenu() {
        const currentValue = (this.isMenuOpen$ as BehaviorSubject<boolean>).value;

        (this.isMenuOpen$ as BehaviorSubject<boolean>).next(!currentValue);
    }

    onSelectedPageId(pageId: string) {
        (this.selectedPageId$ as BehaviorSubject<string>).next(pageId);
    }
}
