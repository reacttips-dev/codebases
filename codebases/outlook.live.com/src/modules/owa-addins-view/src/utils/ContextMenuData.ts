import type { AddinCommandSurfaceItem } from 'owa-addins-types';
import type ContextMenuDataItem from './ContextMenuDataItem';
import { IContextualMenuItem, ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';

export default class ContextMenuData {
    protected data: AddinCommandSurfaceItem[];
    protected menuItemDataList: ContextMenuDataItem[];

    constructor(public key: string, public header?: string) {
        this.menuItemDataList = [];
    }

    public addItem(item: ContextMenuDataItem) {
        this.menuItemDataList.push(item);
    }

    protected generateItemsData() {
        for (const item of this.menuItemDataList) {
            this.data.push(item.generateData());
        }
    }

    public generateData(): AddinCommandSurfaceItem {
        this.data = [];
        this.generateItemsData();
        return {
            key: this.key,
            itemType: ContextualMenuItemType.Section,
            sectionProps: {
                title: this.header,
                items: this.data as IContextualMenuItem[],
            },
        };
    }
}
