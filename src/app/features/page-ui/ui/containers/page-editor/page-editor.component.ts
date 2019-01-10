import {ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    CopyPlugin,
    IPickOutAreaConfig,
    IWallModel,
    IWallUiApi,
    RemoveBrickEvent,
    RemoveBricksEvent,
    SelectedBrickEvent,
    SelectionPlugin,
    TurnBrickIntoEvent,
    UNDO_REDO_API_NAME,
    UndoRedoPlugin,
    WallModelFactory,
    WallPluginInitializedEvent
} from 'ngx-wall';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {EventBusService} from '../../../../../application/event-bus';
import {IPageDataModel} from '../../../../page-service/domain/page-data-model';
import {AddPageEvent} from '../../../../page-service/events/add-page.event';
import {PageBrickDeletedEvent} from '../../../../page-service/events/page-brick-deleted.event';
import {SelectedBricksEvent} from '../../../../page-service/events/selected-bricks.event';
import {UpdatePageContentEvent} from '../../../../page-service/events/update-page-content.event';

@Component({
    selector: 'o-page-editor',
    templateUrl: './page-editor.component.html'
})
export class PageEditorComponent implements OnChanges, OnDestroy, OnInit {
    @Input() page: IPageDataModel;
    @Input() scrollableContainer: HTMLElement;

    pickOutAreaConfig: IPickOutAreaConfig = {
        scrollableContainer: null
    };

    pageForm: FormGroup;
    wallModel: IWallModel;

    private wallUiApi: IWallUiApi;

    private pageChanges$ = new Subject();
    private subscriptions: Subscription[] = [];

    constructor(private wallModelFactory: WallModelFactory,
                private eventBusService: EventBusService,
                private cd: ChangeDetectorRef,
                private injector: Injector,
                private fb: FormBuilder) {
        this.pageForm = this.fb.group({
            title: this.fb.control('')
        });

        this.subscriptions.push(
            this.pageForm.valueChanges.subscribe(() => {
                this.updatePage();
            })
        );

        // initialize wall model
        this.wallModel = this.wallModelFactory.create({
            plugins: [
                new CopyPlugin(this.injector),
                new UndoRedoPlugin(this.injector),
                new SelectionPlugin(this.injector)
            ]
        });

        this.subscriptions.push(
            this.wallModel.subscribe((e) => {
                if ((e instanceof WallPluginInitializedEvent) && this.wallModel.api.ui) {
                    this.wallUiApi = this.wallModel.api.ui;

                    this.subscriptions.push(this.wallUiApi.subscribe((uiEvent) => {
                        if (uiEvent instanceof SelectedBrickEvent) {
                            this.dispatch(new SelectedBricksEvent(uiEvent.selectedBrickIds));
                        }
                    }));
                }
            })
        );

        this.subscriptions.push(
            this.wallModel.api.core.subscribe((event) => {
                if (event instanceof RemoveBrickEvent && event.brick.tag === 'page') {
                    this.removePage(event.brick.state.id);
                }

                if (event instanceof RemoveBricksEvent) {
                    event.bricks.filter((removedBrick) => removedBrick.tag === 'page')
                        .forEach((removedBrick) => this.removePage(removedBrick.state.id));
                }

                if (event instanceof TurnBrickIntoEvent) {
                    if (event.newTag === 'page') {
                        const addPageEvent = new AddPageEvent();

                        addPageEvent.pageId = event.brickId;
                        addPageEvent.parentPageId = this.page.id;

                        this.dispatch(addPageEvent);
                    }
                }

                this.updatePage();
            })
        );
    }

    ngOnInit() {
        this.pickOutAreaConfig.scrollableContainer = this.scrollableContainer;

        this.subscriptions.push(
            this.pageChanges$.pipe(
                debounceTime(500)
            ).subscribe((newPageData) => {
                this.dispatch(new UpdatePageContentEvent(this.page.id, newPageData));
            })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.page) {
            // new page selected
            if (!changes.page.previousValue || this.page.id !== changes.page.previousValue.id) {
                if (this.wallModel) {
                    this.wallModel.api[UNDO_REDO_API_NAME].clear();
                }

                this.wallModel.api.core.setPlan(this.page.body);
            }

            if (changes.page.previousValue && this.page.id === changes.page.previousValue.id) {
                if (this.wallModel.api.core.getBricksCount() !== this.page.body.bricks.length) {
                    this.wallModel.api.core.setPlan(this.page.body);
                }
            }

            if (this.pageForm.get('title').value !== this.page.title) {
                this.pageForm.patchValue({
                    title: this.page.title
                });
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    onEnterHandler() {
        const brickIds = this.wallModel.api.core.getBrickIds();

        if (!brickIds.length) {
            this.wallModel.api.core.addBrickAtStart('text');
        } else {
            this.wallUiApi.focusOnBrickId(brickIds[0]);
        }
    }

    private updatePage() {
        this.pageChanges$.next({
            title: this.pageForm.get('title').value,
            body: this.wallModel.api.core.getPlan()
        });
    }

    private dispatch(e) {
        this.eventBusService.dispatch(e);
    }

    private removePage(pageId: string) {
        this.dispatch(new PageBrickDeletedEvent(pageId));
    }
}
