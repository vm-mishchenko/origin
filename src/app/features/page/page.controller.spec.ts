import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {of} from 'rxjs/internal/observable/of';
import {FIREBASE_CONFIG} from '../../app.config';
import {PageRepository} from './domain/page.repository';
import {PageController} from './page.controller';
import {PageModule} from './page.module';

describe('PageController', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                PageModule,
                RouterTestingModule,
                AngularFireModule.initializeApp(FIREBASE_CONFIG)
            ],
            providers: [
                {
                    provide: AngularFireAuth,
                    useValue: {
                        authState: of(null)
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        const pageRepository: PageRepository = TestBed.get(PageRepository);

        spyOn(pageRepository, 'save').and.returnValue(Promise.resolve());
    });

    it('should be defined', () => {
        const pageController = TestBed.get(PageController);

        expect(pageController).toBeDefined();
    });

    describe('Move', () => {
        it('should move text bricks', (done) => {
            const pageRepository: PageRepository = TestBed.get(PageRepository);

            const pages = {
                source: pageRepository.createPageModel({
                    id: 'source',
                    parentId: null,
                    title: 'source',
                    body: null
                }),
                target: pageRepository.createPageModel({
                    id: 'target',
                    parentId: null,
                    title: 'target',
                    body: null
                })
            };

            const textSnapshot = pages.source.addBrick('text', {text: '1'});

            spyOn(pageRepository, 'get').and.callFake((pageId) => {
                return Promise.resolve(pages[pageId]);
            });

            const pageController: PageController = TestBed.get(PageController);

            pageController.moveBricks('source', [textSnapshot.id], 'target').then(() => {
                expect(pages.source.hasBrick(textSnapshot.id)).toBe(false);
                expect(pages.target.hasBricks()).toBe(true);

                done();
            });
        });

        it('should not move page to parent if it already in the parent', (done) => {
            const pageRepository: PageRepository = TestBed.get(PageRepository);

            const pages = {
                source: pageRepository.createPageModel({
                    id: 'source',
                    parentId: 'target',
                    title: 'source',
                    body: null
                }),
                target: pageRepository.createPageModel({
                    id: 'target',
                    parentId: null,
                    title: 'target',
                    body: null
                })
            };

            spyOn(pageRepository, 'get').and.callFake((pageId) => {
                return Promise.resolve(pages[pageId]);
            });

            const pageBrickSnapshot = pages.target.addChildPage(pages.source.state.id);

            spyOn(pages.source, 'updateParentId');

            const pageController: PageController = TestBed.get(PageController);

            pageController.movePage(pages.source.state.id, pages.target.state.id).then(() => {
                expect(pages.source.updateParentId).not.toHaveBeenCalled();
                expect(pages.target.hasBrick(pageBrickSnapshot.id)).toBe(true);

                done();
            });
        });
    });
});
