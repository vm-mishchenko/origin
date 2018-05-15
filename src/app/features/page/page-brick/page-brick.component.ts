import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventBusService} from '../../../application/event-bus';
import {Guid} from '../../../infrastructure/utils';
import {IPageDataModel} from '../domain/page-data-model';
import {PageSelectedEvent} from '../events/page-selected.event';
import {PageUiController} from '../page-ui.controller';

@Component({
    selector: 'page-brick',
    templateUrl: './page-brick.component.html',
    styleUrls: ['./page-brick.component.scss']
})
export class PageBrickComponent implements OnInit {
    @Input() id: string;
    @Input() state: { id: string };

    @Output() stateChanges: EventEmitter<{ id: string }> = new EventEmitter();

    // local state
    page$: Observable<IPageDataModel>;

    constructor(private pageUiController: PageUiController,
                private guid: Guid,
                private eventBusService: EventBusService) {
    }

    ngOnInit(): void {
        this.page$ = this.pageUiController.pages$.pipe(
            map((pages) => {
                return pages.find((page) => page.id === this.state.id);
            })
        );

        if (!this.state || !this.state.id) {
            this.state = {
                id: this.id
            };

            this.save();
        }
    }

    selectedPage() {
        this.eventBusService.dispatch(new PageSelectedEvent(this.state.id));
    }

    private save() {
        this.stateChanges.emit(this.state);
    }
}
