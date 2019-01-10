import {Injectable} from '@angular/core';
import {Radar, SpotModel, StartWorkingEvent, StopWorkingEvent, TowService, WorkInProgressEvent} from 'ngx-wall';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ConnectableObservable} from 'rxjs/internal/observable/ConnectableObservable';
import {filter, map, merge, publishReplay} from 'rxjs/operators';
import {EventBusService} from '../../application/event-bus';
import {IPageDataModel} from '../page-service/domain/page-data-model';
import {MoveBricksToPageEvent} from '../page-service/events/move-bricks-to-page.event';
import {MovePageEvent} from '../page-service/events/move-page.event';
import {PageInUrlSelectedEvent} from '../page-service/events/page-in-url-selected.event';
import {SelectedBricksEvent} from '../page-service/events/selected-bricks.event';
import {PageController} from '../page-service/page.controller';

export interface IPageTreeDataItem extends IPageDataModel {
    pageIds: string[];
    isDropZone: boolean;
}

@Injectable()
export class PageUiController {
    pages$: Observable<IPageDataModel[]> = this.pageController.pages.states$;

    // for page tree component
    pageTreeComponent$: Observable<IPageTreeDataItem[]>;

    // Drag and Drop Pages
    // todo: what the heck is that!?
    pageDropZoneSpot$: Observable<SpotModel> = new BehaviorSubject(null);

    constructor(private eventBusService: EventBusService,
                private pageController: PageController) {
        this.pageTreeComponent$ = this.pageController.pages.events$.pipe(
            filter((event) => {
                return event.actionName === 'all';
            }),
            merge(this.pageDropZoneSpot$),
            map(() => {
                return this.pageController.pages.map((page) => {
                    const pageDropZoneSpot: SpotModel = (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>)
                        .getValue();

                    return {
                        ...page.toJSON(),
                        pageIds: page.getChildPageIds(),
                        isDropZone: pageDropZoneSpot ? page.state.id === pageDropZoneSpot.data.pageId : false
                    };
                });
            })
        );
    }
}
