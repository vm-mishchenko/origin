import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HomeController} from '../../../home/containers/home/home.controller';
import {PageEditorViewController} from './page-editor-view.controller';

@Component({
    templateUrl: './page-editor-view.component.html',
    styleUrls: ['./page-editor-view.component.scss'],
    providers: [PageEditorViewController]
})
export class PageEditorViewComponent implements OnInit {
    constructor(public pageEditorViewController: PageEditorViewController,
                private route: ActivatedRoute,
                private homeController: HomeController) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: { id: string }) => {
            this.pageEditorViewController.onSelectedPageId(params.id);
            this.homeController.closeMenu();
        });
    }

    showMenu() {
        this.homeController.switchMenu();
    }
}
