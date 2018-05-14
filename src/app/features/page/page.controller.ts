import { Injectable } from '@angular/core';
import { IWallDefinition } from 'ngx-wall';
import { EventBusService } from '../../application/event-bus';
import { NavigateToPageEvent } from '../../application/navigation';
import { NavigateToDefaultPageEvent } from '../../application/navigation/events/navigate-to-default-page.event';
import { Collection } from '../../core/model/collection';
import { FirebaseFileUploaderService } from '../../infrastructure/firebase-file-uploader';
import { ILogger, LoggerFactoryService } from '../../infrastructure/logger';
import { IUserData, LoginDataStreams } from '../login';
import { Page } from './domain/page.model';
import { PageRepository } from './domain/page.repository';
import { AddPageEvent } from './events/add-page.event';
import { DeletePageEvent } from './events/delete-page.event';
import { LoadPageEvent } from './events/load-page.event';
import { MoveBricksToPageEvent } from './events/move-bricks-to-page.event';
import { MovePageEvent } from './events/move-page.event';
import { PageBrickDeletedEvent } from './events/page-brick-deleted.event';
import { PageInUrlSelectedEvent } from './events/page-in-url-selected.event';
import { PageSelectedEvent } from './events/page-selected.event';
import { UpdatePageContentEvent } from './events/update-page-content.event';

@Injectable()
export class PageController {
    pages: Collection<Page> = new Collection();

    selectedPageId: string;

    private logger: ILogger = this.loggerFactoryService.create('PageController');

    private user: IUserData;

    constructor(private pageRepository: PageRepository,
                private loginDataStreams: LoginDataStreams,
                private loggerFactoryService: LoggerFactoryService,
                private firebaseFileUploaderService: FirebaseFileUploaderService,
                private eventBusService: EventBusService) {
        // load root pages
        this.loginDataStreams.user$
            .subscribe((user) => {
                if (user) {
                    this.user = user;

                    this.pageRepository.getRootPageIds()
                        .subscribe((rootPageIds) => {
                            rootPageIds.forEach((rootPageId) => {
                                this.getPageFromPagesCollectionOrRepository(rootPageId);
                            });
                        });
                } else {
                    this.user = null;

                    this.pages.clear();
                }
            });

        this.eventBusService.actions$.subscribe((action) => {
            if (action instanceof DeletePageEvent) {
                this.deletePage(action.pageId);
            }

            if (action instanceof AddPageEvent) {
                this.addPage(action.pageId, action.parentPageId, action.metadata);
            }

            if (action instanceof PageSelectedEvent) {
                this.navigateToPage(action.pageId);
            }

            if (action instanceof LoadPageEvent) {
                this.loadPage(action.pageId);
            }

            if (action instanceof UpdatePageContentEvent) {
                this.updatePageContent(action.pageId, action.content.title, action.content.body);
            }

            if (action instanceof PageInUrlSelectedEvent) {
                this.onPageInUrlSelected(action.pageId);
            }

            if (action instanceof PageBrickDeletedEvent) {
                this.onPageBrickDeleted(action.pageId);
            }

            if (action instanceof MovePageEvent) {
                this.movePage(action.movedPageId, action.targetPageId);
            }

            if (action instanceof MoveBricksToPageEvent) {
                this.moveBricks(action.sourcePagedId, action.movedBrickIds, action.targetPageId);
            }

            if (action instanceof PageInUrlSelectedEvent) {
                this.selectedPageId = action.pageId;
            }
        });

        this.firebaseFileUploaderService.registerFileReferenceHook((filePath: string) => {
            // todo: add selectedPageId assuming that that file path related to brick from current page
            // ngx-wall should automatically add brick id and brick type to file path

            return `${this.user.uid}/${this.selectedPageId}/${filePath}`;
        });
    }

    onPageBrickDeleted(pageId: string): Promise<any> {
        // remove from page collection
        const page = this.pages.remove((currentPage) => currentPage.state.id === pageId);

        if (page) {
            const promises = [];

            // remove page from repository
            promises.push(this.pageRepository.remove(page.state.id));

            // recursively remove all child pages
            if (page.hasChildPages()) {
                promises.push(this.deletePageChildren(page));
            }

            return Promise.all(promises);
        } else {
            this.logger.warning('Can not delete page. Seems it was already deleted.');

            return Promise.resolve();
        }
    }

    onPageInUrlSelected(pageId: string): Promise<any> {
        return this.getPageFromPagesCollectionOrRepository(pageId).then((selectedPage) => {
            if (selectedPage) {
                // 1. load child pages
                const promises = selectedPage.getChildPageIds()
                    .map((childPageId) => this.getPageFromPagesCollectionOrRepository(childPageId));

                // 2. load all parents
                promises.push(this.loadParentPages(selectedPage));

                return Promise.all(promises);
            } else {
                this.navigateToDefaultPage();
            }
        });
    }

    updatePageContent(pageId: string, title?: string, body?: IWallDefinition) {
        this.getPageFromPagesCollectionOrRepository(pageId).then((page) => {
            if (body) {
                page.updateBody(body);
            }

            if (title || title === '') {
                page.updateTitle(title);
            }

            this.pageRepository.save(page);
        });
    }

    navigateToPage(pageId: string): void {
        this.eventBusService.dispatch(new NavigateToPageEvent(pageId));
    }

    addPage(pageId: string, parentPageId: string, metadata: any): Promise<void> {
        return this.pageRepository.create(pageId, parentPageId)
            .then((page: Page) => {
                this.addPageToPageCollection(page);

                if (metadata && metadata.navigate) {
                    this.navigateToPage(page.state.id);
                }
            });
    }

    movePage(movedPageId: string, targetPageId?: string): Promise<any> {
        if (movedPageId === targetPageId) {
            return Promise.resolve();
        }

        let operationPromises = [];

        operationPromises.push(this.getPageFromPagesCollectionOrRepository(movedPageId));

        if (targetPageId) {
            operationPromises.push(this.getPageFromPagesCollectionOrRepository(targetPageId));
        }

        // load moved and target pages
        return Promise.all(operationPromises).then(([movedPage, targetPage]: [Page, Page]) => {
            operationPromises = [];

            const previousParentId = movedPage.state.parentId;

            if (!previousParentId && !targetPageId) {
                // page already at the top of tree
                return Promise.resolve();
            }

            if (targetPageId && targetPage.hasChildPage(movedPage.state.id)) {
                // moved page already in target page
                return Promise.resolve();
            }

            // update parentId for current page
            movedPage.updateParentId(targetPage ? targetPage.state.id : null);

            operationPromises.push(this.pageRepository.save(movedPage));

            // add page brick to new parent page
            if (targetPage) {
                targetPage.addChildPage(movedPage.state.id);

                operationPromises.push(this.pageRepository.save(targetPage));
            }

            return Promise.all(operationPromises).then(() => {
                // remove movedPage brick from old parent if all operations finished successfully
                if (previousParentId) {
                    return this.getPageFromPagesCollectionOrRepository(previousParentId).then((previousParentPage) => {
                        previousParentPage.removeChildPage(movedPage.state.id);

                        return this.pageRepository.save(previousParentPage);
                    });
                }
            });
        });
    }

    moveBricks(sourcePagedId: string, movedBrickIds: string[], targetPageId: string): Promise<any> {
        return Promise.all([
            this.getPageFromPagesCollectionOrRepository(sourcePagedId),
            this.getPageFromPagesCollectionOrRepository(targetPageId)
        ]).then(([sourcePage, targetPage]: [Page, Page]) => {
            // filter brick which belong to target page already
            movedBrickIds = movedBrickIds.filter((movedBrickId) => !targetPage.hasBrick(movedBrickId));

            if (movedBrickIds.length) {
                movedBrickIds
                    .reverse()
                    .filter((movedBrickId) => {
                        return sourcePage.hasBrick(movedBrickId) && !sourcePage.isPageBrick(movedBrickId);
                    })
                    .forEach((movedBrickId) => {
                        const removedBrickSnapshot = sourcePage.removeBrick(movedBrickId);

                        targetPage.addBrick(removedBrickSnapshot.tag, removedBrickSnapshot.state);
                    });

                const movePromises = movedBrickIds
                    .filter((movedBrickId) => {
                        return sourcePage.hasBrick(movedBrickId) && sourcePage.isPageBrick(movedBrickId);
                    })
                    .map((movedPageBrickId) => {
                        return this.movePage(sourcePage.getPageIdByBrickId(movedPageBrickId), targetPage.state.id);
                    });

                return Promise.all(movePromises).then(() => {
                    return Promise.all([
                        this.pageRepository.save(sourcePage),
                        this.pageRepository.save(targetPage)
                    ]);
                });
            } else {
                return Promise.resolve([]);
            }
        });
    }

    loadPage(pageId: string): Promise<Page> {
        return this.pageRepository.get(pageId).then((page) => {
            this.addPageToPageCollection(page);

            return page;
        });
    }

    // remove from pages
    // remove page from repository
    // update parent page body
    // remove child pages
    deletePage(pageId: string) {
        let parentPage: Page;

        const promises = [];

        const page = this.pages.remove((currentPage) => currentPage.state.id === pageId);

        promises.push(page.clearBrickExternalLinks());

        promises.push(this.pageRepository.remove(page.state.id));

        if (page.state.parentId) {
            parentPage = this.pages.find((currentPage) => currentPage.state.id === page.state.parentId);

            parentPage.removeChildPage(page.state.id);

            promises.push(this.pageRepository.save(parentPage));

            this.navigateToPage(page.state.parentId);
        } else {
            this.navigateToDefaultPage();
        }

        if (page.hasChildPages()) {
            promises.push(this.deletePageChildren(page));
        }

        return Promise.all(promises);
    }

    // 1. remove child page from pages
    // 2. remove child pages from repository
    // 3. repeat "deletePageChildren" for child page
    private deletePageChildren(parentPage: Page) {
        // download pages
        const childPagePromises = parentPage.getChildPageIds()
            .map((childPageId) => this.getPageFromPagesCollectionOrRepository(childPageId));

        return Promise.all(childPagePromises).then((childPages) => {
            const removeChildPagePromises = [];

            childPages.forEach((childPage) => {
                // remove from pages
                this.pages.remove((currentPage) => currentPage.state.id === childPage.state.id);

                removeChildPagePromises.push(childPage.clearBrickExternalLinks());

                removeChildPagePromises.push(this.pageRepository.remove(childPage.state.id));

                // recursively remove all child pages
                if (childPage.hasChildPages()) {
                    removeChildPagePromises.push(this.deletePageChildren(childPage));
                }
            });

            return removeChildPagePromises;
        });
    }

    private getPageFromPagesCollectionOrRepository(id: string): Promise<Page> {
        const pageFromStore = this.pages.find((page) => page.state.id === id);

        if (pageFromStore) {
            return Promise.resolve(pageFromStore);
        } else {
            return this.loadPage(id).then((page) => {
                if (page) {
                    this.addPageToPageCollection(page);
                }

                return page;
            });
        }
    }

    private addPageToPageCollection(page: Page) {
        if (!this.pages.find((currentPage) => currentPage.state.id === page.state.id)) {
            this.pages.add(page);
        }
    }

    private loadParentPages(page: Page): Promise<any> {
        if (page.state.parentId) {
            return this.getPageFromPagesCollectionOrRepository(page.state.parentId).then((parentPage) => {
                return this.loadParentPages(parentPage);
            });
        } else {
            return Promise.resolve();
        }
    }

    private navigateToDefaultPage() {
        this.eventBusService.dispatch(new NavigateToDefaultPageEvent());
    }
}
