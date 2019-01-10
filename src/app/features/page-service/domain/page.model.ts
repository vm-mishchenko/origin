import {IBrickSnapshot, IWallDefinition, IWallModel, WallModelFactory} from 'ngx-wall';
import {Model} from '../../../core/model/model';
import {IPageDataModel} from './page-data-model';

export class Page extends Model<IPageDataModel> {
    private wallModelFactory: WallModelFactory;
    private wallModel: IWallModel;

    constructor(options: {
        state: IPageDataModel,
        wallModelFactory: WallModelFactory
    }) {
        super(options.state);

        this.wallModelFactory = options.wallModelFactory;

        this.wallModel = this.wallModelFactory.create();

        if (options.state.body) {
            this.wallModel.api.core.setPlan(options.state.body);
        } else {
            this.updateState({body: this.wallModel.api.core.getPlan()});
        }
    }

    hasChildPage(pageId: string): boolean {
        const childPages = this.getChildPageBricks().filter((pageBrickSnapshot: IBrickSnapshot) => {
            return pageBrickSnapshot.state.id === pageId;
        });

        return Boolean(childPages.length);
    }

    hasChildPages(): boolean {
        return Boolean(this.getChildPageBricks().length);
    }

    getChildPageIds(): string[] {
        return this.getChildPageBricks().map((pageBrick) => pageBrick.state.id);
    }

    hasBrick(brickId: string): boolean {
        return Boolean(this.wallModel.api.core.getBrickIds().find((currentBrickId) => currentBrickId === brickId));
    }

    hasBricks(): boolean {
        return Boolean(this.wallModel.api.core.getBricksCount);
    }

    isPageBrick(brickId: string): boolean {
        return this.wallModel.api.core.getBrickSnapshot(brickId).tag === 'page';
    }

    getPageIdByBrickId(brickId: string): string {
        return this.wallModel.api.core.getBrickSnapshot(brickId).state.id;
    }

    addBrick(tag: string, state: any): IBrickSnapshot {
        return this.wallModel.api.core.addBrickAtStart(tag, state);
    }

    removeBrick(brickId: string): IBrickSnapshot {
        const brickSnapshot = this.wallModel.api.core.getBrickSnapshot(brickId);

        this.wallModel.api.core.removeBrick(brickId);

        this.updateState({
            body: this.wallModel.api.core.getPlan()
        });

        return brickSnapshot;
    }

    removeChildPage(childPageId: string): void {
        this.getChildPageBricks()
            .filter((pageBrick) => pageBrick.state.id === childPageId)
            .map((pageBrick) => {
                this.wallModel.api.core.removeBrick(pageBrick.id);
            });

        this.updateState({
            body: this.wallModel.api.core.getPlan()
        });
    }

    addChildPage(childPageId: string): IBrickSnapshot {
        const pageBrickSnapshot = this.wallModel.api.core.addBrickAtStart('page', {
            id: childPageId
        });

        this.updateState({
            body: this.wallModel.api.core.getPlan()
        });

        return pageBrickSnapshot;
    }

    updateParentId(parentId: string) {
        this.updateState({parentId});
    }

    updateTitle(title: string): void {
        this.updateState({
            title
        });
    }

    updateBody(body: IWallDefinition): void {
        this.wallModel.api.core.setPlan(body);

        this.updateState({
            body: this.wallModel.api.core.getPlan()
        });
    }

    toJSON() {
        const originalJSON = super.toJSON();

        originalJSON.body = this.wallModel.api.core.getPlan();

        return originalJSON;
    }

    clearBrickExternalLinks(): Promise<void> {
        return this.wallModel.api.core.clear();
    }

    private updateState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
    }

    private getChildPageBricks(): IBrickSnapshot[] {
        return this.wallModel.api.core.filterBricks((brick: IBrickSnapshot) => brick.tag === 'page');
    }
}
