import getIconProps from '../components/SurfaceActionIconProps';
import type { AddinCommandSurfaceItem } from 'owa-addins-types';
import { createAddinMarketplaceItem } from './AddinMarketplaceItem';
import type { IAddin } from 'owa-addins-store';
import { ContextualMenuItemType, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';

export default function createAddinOptionSurfaceItems(addins: IAddin[]): AddinCommandSurfaceItem[] {
    const addinCommandSurfaceItems = addins.map(createAddinOptionSurfaceItem);
    addinCommandSurfaceItems.push(createAddinMarketplaceOptionSurfaceItem());
    return addinCommandSurfaceItems;
}

function createAddinOptionSurfaceItem(addin: IAddin): AddinCommandSurfaceItem {
    return <AddinCommandSurfaceItem>{
        key: addin.Id,
        name: addin.DisplayName,
        itemType: ContextualMenuItemType.Normal,
        iconProps: getIconProps(addin.IconUrl),
    };
}

function createAddinMarketplaceOptionSurfaceItem(): AddinCommandSurfaceItem {
    const addinMarketplaceItem: IContextualMenuItem = createAddinMarketplaceItem();
    return <AddinCommandSurfaceItem>{
        key: addinMarketplaceItem.key,
        name: addinMarketplaceItem.name,
        itemType: addinMarketplaceItem.itemType,
        iconProps: addinMarketplaceItem.iconProps,
    };
}
