import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {StorageService} from '../../../infrastructure/storage/storage.service';
import {IPageDataModel} from '../domain/page-data-model';

/*
 *
 * Firebase database structure
 *
 * {
 *    pages: {
 *      $uid: {
 *        pageId: []
 *      }
 *    }
 * }
 *
 */

@Injectable()
export class PageGateway {
    pagesTokenName = 'pages';

    constructor(private storageService: StorageService) {
    }

    getRootPageIds(uid: string): Observable<string[]> {
        const dbKey = `${this.pagesTokenName}/${uid}`;

        return this.storageService.getList(dbKey, (ref) => ref.orderByChild('parentId').equalTo(null)).pipe(
            map((pages: any[]) => pages.map((pageData: any) => pageData.id))
        );
    }

    get(id: string, uid: string): Observable<IPageDataModel> {
        const dbKey = `${this.pagesTokenName}/${uid}/${id}`;

        return this.storageService.getItem(dbKey).pipe(
            first(),
            map((pageData: any) => {
                if (pageData) {
                    // page exists
                    if (pageData.body) {
                        pageData.body = JSON.parse(pageData.body);
                    }

                    return pageData;
                }
            })
        );
    }

    save(pageData: IPageDataModel, uid: string): Promise<void> {
        const dbKey = `${this.pagesTokenName}/${uid}/${pageData.id}`;

        return this.storageService.setItem(dbKey, {
            body: JSON.stringify(pageData.body),
            id: pageData.id,
            parentId: pageData.parentId || null,
            title: pageData.title
        });
    }

    remove(id: string, uid: string): Promise<void> {
        const dbKey = `${this.pagesTokenName}/${uid}/${id}`;

        return this.storageService.removeItem(dbKey);
    }
}
