import {Injectable} from '@angular/core';
import {Radar, SpotModel, StartWorkingEvent, StopWorkingEvent, TowService, WorkInProgressEvent} from 'ngx-wall';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {ConnectableObservable} from 'rxjs/internal/observable/ConnectableObservable';
import {filter, map, publishReplay} from 'rxjs/operators';
import {EventBusService} from '../../../../application/event-bus';
import {NavigateToPageEvent} from '../../../../application/navigation';
import {IPageDataModel} from '../../../../features/page-service/domain/page-data-model';
import {MoveBricksToPageEvent} from '../../../../features/page-service/events/move-bricks-to-page.event';
import {MovePageEvent} from '../../../../features/page-service/events/move-page.event';
import {SelectedBricksEvent} from '../../../../features/page-service/events/selected-bricks.event';
import {PageUiController} from '../../../../features/page/page-ui.controller';
import {PageController} from '../../../../features/page-service/page.controller';
import {HomeController} from '../../../home/ui/page-controlles/home/home.controller';

@Injectable()
export class PageEditorViewController {
    selectedPage$: Observable<IPageDataModel>;

    // Drag and Drop Pages
    private selectedBrickIds: string[] = [];

    constructor(private eventBusService: EventBusService,
                private pageController: PageController,
                public homeController: HomeController,
                // todo: inject pageUiController only for pageDropZoneSpot$. WTF is that?
                private pageUiController: PageUiController,
                private radar: Radar,
                private towService: TowService) {
        // todo: find more elegant solution
        const selectedPageConnectedObservable = combineLatest(
            this.pageController.pages.states$,
            this.homeController.selectedPageId$
        ).pipe(
            map(([pageStates, selectedPageId]) => {
                return pageStates.find((pageState) => pageState.id === selectedPageId);
            }),
            publishReplay(1)
        ) as ConnectableObservable<any>;

        selectedPageConnectedObservable.connect();

        this.selectedPage$ = selectedPageConnectedObservable;

        // store currently selected brick ids
        this.eventBusService.actions$.pipe(
            filter((action) => action instanceof SelectedBricksEvent)
        ).subscribe((action: SelectedBricksEvent) => {
            this.selectedBrickIds = action.selectedBrickIds;
        });

        this.initPageDragAndDropHighlight();
    }

    onSelectedPageId(pageId: string) {
        this.homeController.onSelectedPageId(pageId);
    }

    navigateToPage(pageId: string) {
        this.eventBusService.dispatch(new NavigateToPageEvent(pageId));
    }

    private initPageDragAndDropHighlight() {
        this.towService.subscribe((e) => {
            if (e instanceof StartWorkingEvent) {
                (this.pageUiController.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(null);
            }

            if (e instanceof StopWorkingEvent) {
                const pageSpots = this.radar.filterSpots((spot: SpotModel) => {
                    return spot.data.isPage && spot.data.pageId === e.slaveId;
                });

                const pageDropZoneSpot = (this.pageUiController.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).getValue();

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
                        (this.homeController.selectedPageId$ as BehaviorSubject<string>).getValue(),
                        movedBrickIds,
                        pageDropZoneSpot.data.pageId
                    ));
                }

                (this.pageUiController.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(null);
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

                const currentSpotModel = (this.pageUiController.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).getValue();

                if (currentSpotModel !== allSpots[allSpots.length - 1]) {
                    (this.pageUiController.pageDropZoneSpot$ as BehaviorSubject<SpotModel>).next(allSpots[allSpots.length - 1]);
                }
            }
        });
    }
}
