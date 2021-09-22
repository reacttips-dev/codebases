import type { AddinCommandSurfaceItem, ContextMenuDataItemClick } from 'owa-addins-types';
import type ContextMenuData from './ContextMenuData';
import getIconProps from '../components/SurfaceActionIconProps';
import { IContextualMenuItem, ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';

export default class ContextMenuDataItem {
    public description: string;
    public accessibilityText: string;
    public subMenuData: ContextMenuData;
    public getClickHandler: ContextMenuDataItemClick;
    public iconUrl: string;
    constructor(protected key?: string, protected name?: string) {}

    public generateData(): AddinCommandSurfaceItem {
        return {
            id: this.key,
            key: this.key,
            name: this.name,
            title: this.description,
            ariaLabel: this.accessibilityText,
            iconProps: getIconProps(this.iconUrl),
            itemType: ContextualMenuItemType.Normal,
            getClickHandler: this.getClickHandler,
            subMenuProps: this.subMenuData
                ? {
                      items: [this.subMenuData.generateData() as IContextualMenuItem],
                  }
                : null,
        };
    }
}
