export interface IPageTreeItem {
    id: string;
    title: string;
    level: number;
    isOpen: boolean;
    isSelected: boolean;
    pageIds: string[];
    parent: IPageTreeItem;
    pages: IPageTreeItem[];
    isDropZone: boolean;
}
