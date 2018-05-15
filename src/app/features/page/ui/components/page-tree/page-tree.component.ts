import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Radar, TowService} from 'ngx-wall';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventBusService} from '../../../../../application/event-bus';
import {Inquire} from '../../../../../components/inquire';
import {PageRepository} from '../../../domain/page.repository';
import {DeletePageEvent} from '../../../events/delete-page.event';
import {LoadPageEvent} from '../../../events/load-page.event';
import {PageSelectedEvent} from '../../../events/page-selected.event';
import {IPageTreeDataItem, PageUiController} from '../../../page-ui.controller';
import {IPageTreeItem} from './page-tree.interfaces';

@Component({
    selector: 'o-page-tree',
    templateUrl: './page-tree.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTreeComponent implements OnInit {
    pageTree$: Observable<IPageTreeItem[]>;

    @Output() selectedPage: EventEmitter<string> = new EventEmitter();

    // needed for restoring isOpen state
    private previousFlatPageItemList: IPageTreeItem[] = [];

    constructor(private inquire: Inquire,
                private eventBusService: EventBusService,
                private pageRepository: PageRepository,
                private radar: Radar,
                private towService: TowService,
                private pageUiController: PageUiController) {
    }

    ngOnInit() {
        this.pageTree$ = combineLatest(
            this.pageUiController.pageTreeComponent$,
            this.pageUiController.selectedPageId$
        ).pipe(
            map(([pageTreeComponents, selectedPageId]) => {
                const previousFlatPageItemList = this.previousFlatPageItemList.slice(0);

                this.previousFlatPageItemList = [];

                return this.buildPageTreeChild(
                    null,
                    pageTreeComponents,
                    2,
                    selectedPageId,
                    previousFlatPageItemList);
            })
        );
    }

    buildPageTreeChild(parentPageTreeItem: IPageTreeItem,
                       pageTreeComponents: IPageTreeDataItem[], level: number, selectedPageId: string,
                       previousFlatPageItemList: IPageTreeItem[]): IPageTreeItem[] {
        return pageTreeComponents
            .filter((page) => parentPageTreeItem ? parentPageTreeItem.id === page.parentId : !page.parentId)
            .map((pageTreeComponent) => {
                const previousPageItem = previousFlatPageItemList.find((currentPreviousPageItem) => {
                    return currentPreviousPageItem.id === pageTreeComponent.id;
                });

                const pageTreeItem = {
                    id: pageTreeComponent.id,
                    title: pageTreeComponent.title,
                    isOpen: previousPageItem && previousPageItem.isOpen,
                    isSelected: selectedPageId === pageTreeComponent.id,
                    level,
                    parent: parentPageTreeItem,
                    pageIds: pageTreeComponent.pageIds,
                    pages: [],
                    isDropZone: pageTreeComponent.isDropZone
                };

                if (pageTreeItem.pageIds.length) {
                    pageTreeItem.pages = this.buildPageTreeChild(
                        pageTreeItem,
                        pageTreeComponents,
                        level + 1,
                        selectedPageId,
                        previousFlatPageItemList
                    );
                }

                if (!previousPageItem && pageTreeItem.id === selectedPageId) {
                    let currentPage = pageTreeItem.parent;

                    while (currentPage) {
                        currentPage.isOpen = true;

                        currentPage = currentPage.parent;
                    }
                }

                this.previousFlatPageItemList.push(pageTreeItem);

                return pageTreeItem;
            });
    }

    onPageSelected(pageId: string) {
        this.eventBusService.dispatch(new PageSelectedEvent(pageId));
    }

    onDeletePage(pageId: string) {
        this.inquire.confirm('Are you sure?').then(() => {
            this.eventBusService.dispatch(new DeletePageEvent(pageId));
        }, () => {
        });
    }

    onLoadChildPages(childPageIds: string[]) {
        childPageIds.forEach((childPageId) => {
            this.eventBusService.dispatch(new LoadPageEvent(childPageId));
        });
    }

    trackById(index: number, item: IPageTreeItem) {
        return item.id;
    }
}
