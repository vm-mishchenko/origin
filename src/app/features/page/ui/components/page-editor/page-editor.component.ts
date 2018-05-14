import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    IPickOutAreaConfig,
    IWallConfiguration,
    IWallModel,
    RemoveBrickEvent,
    RemoveBricksEvent,
    SelectedBrickEvent,
    TurnBrickIntoEvent,
    WallApi,
    WallModelFactory
} from 'ngx-wall';
import 'rxjs/add/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { EventBusService } from '../../../../../application/event-bus';
import { IPageDataModel } from '../../../domain/page-data-model';
import { AddPageEvent } from '../../../events/add-page.event';
import { PageBrickDeletedEvent } from '../../../events/page-brick-deleted.event';
import { SelectedBricksEvent } from '../../../events/selected-bricks.event';
import { UpdatePageContentEvent } from '../../../events/update-page-content.event';

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

    private pageForm: FormGroup;
    private pageFormSubscription: Subscription;

    private wallModel: IWallModel;
    private wallModelSubscription: any;

    private pageChanges$ = new Subject();
    private pageChangesSubscription: Subscription;

    private wallApi: WallApi;
    private wallConfiguration: IWallConfiguration;

    constructor(private wallModelFactory: WallModelFactory,
                private eventBusService: EventBusService,
                private cd: ChangeDetectorRef,
                private fb: FormBuilder) {
        this.pageForm = this.fb.group({
            title: this.fb.control('')
        });

        this.pageFormSubscription = this.pageForm.valueChanges.subscribe(() => {
            this.updatePage();
        });

        this.wallConfiguration = {
            onRegisterApi: (api: WallApi) => {
                this.wallApi = api;

                this.wallApi.core.subscribe((e) => {
                    if (e instanceof SelectedBrickEvent) {
                        this.dispatch(new SelectedBricksEvent(e.selectedBrickIds));
                    }
                });
            }
        };

        // initialize wall model
        this.wallModel = this.wallModelFactory.create();

        this.wallModelSubscription = this.wallModel.subscribe((event) => {
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
        });
    }

    ngOnInit() {
        this.pickOutAreaConfig.scrollableContainer = this.scrollableContainer;

        this.pageChangesSubscription = this.pageChanges$
            .debounceTime(500)
            .subscribe((newPageData) => {
                this.dispatch(new UpdatePageContentEvent(this.page.id, newPageData));
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.page) {
            // todo: extremely inefficient operation

            // new page selected
            if (!changes.page.previousValue || this.page.id !== changes.page.previousValue.id) {
                if (this.wallApi) {
                    this.wallApi.features.undo.clear();
                }

                this.wallModel.setPlan(this.page.body);
            }

            if (changes.page.previousValue && this.page.id === changes.page.previousValue.id) {
                if (this.wallModel.getBricksCount() !== this.page.body.bricks.length) {
                    this.wallModel.setPlan(this.page.body);
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
        this.pageFormSubscription.unsubscribe();
        this.pageChangesSubscription.unsubscribe();
    }

    onEnterHandler() {
        const brickIds = this.wallModel.getBrickIds();

        if (!brickIds.length) {
            this.wallModel.addBrickAtStart('text');
        } else {
            this.wallApi.core.focusOnBrickId(brickIds[0]);
        }
    }

    private updatePage() {
        this.pageChanges$.next({
            title: this.pageForm.get('title').value,
            body: this.wallModel.getPlan()
        });
    }

    private dispatch(e) {
        this.eventBusService.dispatch(e);
    }

    private removePage(pageId: string) {
        this.dispatch(new PageBrickDeletedEvent(pageId));
    }
}
