import {Injectable} from '@angular/core';
import {WallModelFactory} from 'ngx-wall';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import {Guid} from '../../../infrastructure/utils';
import {IUserData, LoginDataStreams} from '../../login';
import {PageGateway} from '../infrastructure/page.gateway';
import {IPageDataModel} from './page-data-model';
import {Page} from './page.model';

@Injectable()
export class PageRepository {
    private user: IUserData;

    private pageCache: Map<string, Promise<Page>> = new Map();

    constructor(private pageGateway: PageGateway,
                private guid: Guid,
                private wallModelFactory: WallModelFactory,
                private loginDataStreams: LoginDataStreams) {
        this.loginDataStreams.user$.subscribe((currentUser) => {
            this.user = currentUser;
        });
    }

    getRootPageIds(): Observable<string[]> {
        return this.pageGateway.getRootPageIds(this.user.uid)
            .first();
    }

    // cache request
    get(pageId: string): Promise<Page> {
        let pageRequestPromise = this.pageCache.get(pageId);

        if (!pageRequestPromise) {
            pageRequestPromise = this.pageGateway.get(pageId, this.user.uid)
                .map((page) => {
                    return page ? this.restorePage(page) : null;
                })
                .toPromise()
                .then((page) => {
                    this.pageCache.delete(pageId);

                    return page;
                });

            this.pageCache.set(pageId, pageRequestPromise);
        }

        return pageRequestPromise;
    }

    save(page: Page): Promise<any> {
        return this.pageGateway.save(page.toJSON(), this.user.uid);
    }

    remove(id: string): Promise<void> {
        return this.pageGateway.remove(id, this.user.uid);
    }

    create(pageId: string = null, parentId: string = null): Promise<Page> {
        const newPage = this.restorePage({
            parentId,
            id: pageId ? pageId : this.guid.generate(),
            body: null,
            title: 'New page'
        });

        return this.save(newPage).then(() => newPage);
    }

    createPageModel(pageData: IPageDataModel): Page {
        return this.restorePage(pageData);
    }

    private restorePage(pageData: IPageDataModel): Page {
        return new Page({
            state: pageData,
            wallModelFactory: this.wallModelFactory
        });
    }
}
