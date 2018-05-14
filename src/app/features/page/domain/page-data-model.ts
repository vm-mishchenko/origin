import { IWallDefinition } from 'ngx-wall';

export interface IPageDataModel {
    id: string;
    parentId: string;
    title: string;
    body: IWallDefinition;
}
