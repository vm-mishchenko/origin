import {Injectable} from '@angular/core';
import {Radar, SpotModel, StartWorkingEvent, StopWorkingEvent, TowService, WorkInProgressEvent} from 'ngx-wall';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import {EventBusService} from '../../application/event-bus';
import {IPageDataModel} from './domain/page-data-model';
import {MoveBricksToPageEvent} from './events/move-bricks-to-page.event';
import {MovePageEvent} from './events/move-page.event';
import {PageInUrlSelectedEvent} from './events/page-in-url-selected.event';
import {SelectedBricksEvent} from './events/selected-bricks.event';
import {PageController} from './page.controller';

export interface IPageTreeDataItem extends IPageDataModel {
    pageIds: string[];
    isDropZone: boolean;
}

@Injectable()
export class PageUiController {
    pages$: Observable<IPageDataModel[]> = this.pageController.pages.states$;

    // for page tree component
    pageTreeComponent$: Observable<IPageTreeDataItem[]>;

    selectedPageId$: Observable<string> = new BehaviorSubject(null);

    selectedPage$: Observable<IPageDataModel>;

    // Drag and Drop Pages
    private pageDropZoneSpot$: Observable<SpotModel> = new BehaviorSubject(null);
    private selectedBrickIds: string[] = [];

    constructor(private eventBusService: EventBusService,
                private pageController: PageController,
                private radar: Radar,
                private towService: TowService) {
        this.pageTreeComponent$ = this.pageController.pages.events$
            .filter((event) => {
                return event.actionName === 'all';
            })
            .merge(this.pageDropZoneSpot$)
            .map(() => {
                return this.pageController.pages.map((page) => {
                    const pageDropZoneSpot: SpotModel = (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>)
                        .getValue();

                    return {
                        ...page.toJSON(),
                        pageIds: page.getChildPageIds(),
                        isDropZone: pageDropZoneSpot ? page.state.id === pageDropZoneSpot.data.pageId : false
                    };
                });
            });

        // todo: find more elegant solution
        const selectedPageConnectedObservable = combineLatest(
            this.pages$,
            this.selectedPageId$
        ).map(([pageStates, selectedPageId]) => {
            return pageStates.find((pageState) => pageState.id === selectedPageId);
        }).publishReplay(1);

        selectedPageConnectedObservable.connect();

        this.selectedPage$ = selectedPageConnectedObservable;

        this.eventBusService.actions$
            .filter((action) => action instanceof PageInUrlSelectedEvent)
            .subscribe((action: PageInUrlSelectedEvent) => {
                (this.selectedPageId$ as BehaviorSubject<string>).next(action.pageId);
            });

        // store currently selected brick ids
        this.eventBusService.actions$
            .filter((action) => action instanceof SelectedBricksEvent)
            .subscribe((action: SelectedBricksEvent) => {
                this.selectedBrickIds = action.selectedBrickIds;
            });

        this.initPageDragAndDropHighlight();
    }

    private initPageDragAndDropHighlight() {
        this.towService.subscribe((e) => {
            if (e instanceof StartWorkingEvent) {
                (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(null);
            }

            if (e instanceof StopWorkingEvent) {
                const pageSpots = this.radar.filterSpots((spot: SpotModel) => {
                    return spot.data.isPage && spot.data.pageId === e.slaveId;
                });

                const pageDropZoneSpot = (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).getValue();

                // droppable item is page
                if (pageSpots.length) {
                    const targetPageId = pageDropZoneSpot ? pageDropZoneSpot.data.pageId : null;

                    this.eventBusService.dispatch(new MovePageEvent(e.slaveId, targetPageId));
                } else if (pageDropZoneSpot) {
                    // droppable item is bricks
                    let movedBrickIds = [];

                    if (this.selectedBrickIds.length) {
                        movedBrickIds = movedBrickIds.concat(this.selectedBrickIds);
                    } else {
                        movedBrickIds.push(e.slaveId);
                    }

                    this.eventBusService.dispatch(new MoveBricksToPageEvent(
                        (this.selectedPageId$ as BehaviorSubject<string>).getValue(),
                        movedBrickIds,
                        pageDropZoneSpot.data.pageId
                    ));
                }

                (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(null);
            }

            if (e instanceof WorkInProgressEvent) {
                const pageSpots = this.radar
                    .filterSpots((spot: SpotModel) => spot.data.isPage);

                const allSpots = pageSpots.filter((currentSpot) => {
                    return currentSpot.isPointInsideSpot(
                        e.mousePosition.clientX,
                        e.mousePosition.clientY
                    );
                });

                const currentSpotModel = (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).getValue();

                if (currentSpotModel !== allSpots[allSpots.length - 1]) {
                    (this.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(allSpots[allSpots.length - 1]);
                }
            }
        });
    }
}
