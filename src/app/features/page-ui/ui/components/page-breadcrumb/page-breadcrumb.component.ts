import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPageTreeDataItem, PageUiController} from '../../../page-ui.controller';

@Component({
    selector: 'o-page-breadcrumb',
    templateUrl: './page-breadcrumb.component.html',
    styleUrls: ['./page-breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageBreadcrumbComponent implements OnInit {
    @Input() selectedPageId$: Observable<string>;
    @Output() selectedPageId: EventEmitter<string> = new EventEmitter();

    breadcrumbs$: Observable<any[]>;

    constructor(private pageUiController: PageUiController) {
    }

    ngOnInit() {
        this.breadcrumbs$ = combineLatest(
            this.pageUiController.pageTreeComponent$,
            this.selectedPageId$
        ).pipe(
            map(([pageTreeComponents, selectedPageId]) => {
                const pages = [];

                let currentPageTree = pageTreeComponents
                    .find((pageTreeComponent) => pageTreeComponent.id === selectedPageId);

                if (currentPageTree) {
                    pages.push(currentPageTree);

                    while (currentPageTree && currentPageTree.parentId) {
                        const parentPageTree = pageTreeComponents
                            .find((pageTreeComponent) => pageTreeComponent.id === currentPageTree.parentId);

                        if (parentPageTree) {
                            pages.push(parentPageTree);
                        }

                        currentPageTree = parentPageTree;
                    }

                    return pages.reverse();
                }
            })
        );
    }

    onPageSelected(pageTreeDataItem: IPageTreeDataItem) {
        this.selectedPageId.next(pageTreeDataItem.id);
    }
}
