import {Component, Input} from '@angular/core';
import {PageTreeComponent} from './page-tree.component';
import {IPageTreeItem} from './page-tree.interfaces';

@Component({
    selector: 'o-page-tree-item',
    templateUrl: './page-tree-item.component.html',
    styleUrls: ['./page-tree-item.component.scss']
})

export class PageTreeItemComponent {
    @Input() pageTreeItem: IPageTreeItem;

    constructor(public pageTreeComponent: PageTreeComponent) {
    }

    onPageSelected() {
        this.pageTreeComponent.onPageSelected(this.pageTreeItem.id);
    }

    onDeletePage(e) {
        e.stopPropagation();

        this.pageTreeComponent.onDeletePage(this.pageTreeItem.id);
    }

    switchChildVisibility(e) {
        e.stopPropagation();

        this.pageTreeItem.isOpen = !this.pageTreeItem.isOpen;

        if (this.pageTreeItem.isOpen && this.pageTreeItem.pageIds.length && !this.pageTreeItem.pages.length) {
            this.pageTreeComponent.onLoadChildPages(this.pageTreeItem.pageIds);
        }
    }

    trackById(index: number, item: IPageTreeItem) {
        return item.id;
    }
}
