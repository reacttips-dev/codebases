import type * as React from 'react';
import type ContextMenuData from './ContextMenuData';
import type ContextMenuDataItem from './ContextMenuDataItem';
import createAddinContextMenuDataItem from './createAddinContextMenuDataItem';
import createOverflowContextMenuData from './createOverflowContextMenuData';
import executeEntryPoint from '../utils/entryPointOperations/executeEntryPoint';
import { Addin, AddinCommand, getExtensibilityContext } from 'owa-addins-store';
import type { AddinCommandSurfaceItem, ContextMenuDataItemClick } from 'owa-addins-types';
import { createAddinMarketplaceItem, createDivider } from './AddinMarketplaceItem';

export function getClickHandler(command: AddinCommand): ContextMenuDataItemClick {
    return (hostItemIndex: string) => {
        return (event?: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            executeEntryPoint(hostItemIndex, command);
        };
    };
}

export function createAddinCommandSurfaceAction(addin: Addin): AddinCommandSurfaceItem {
    const menuData: ContextMenuDataItem = createAddinContextMenuDataItem(addin);
    return menuData.generateData();
}

export function createAddinCommandSurfaceActions(
    addins: Addin[],
    targetWindow: Window
): AddinCommandSurfaceItem {
    const menuData: ContextMenuData = createOverflowContextMenuData(addins);
    const actions = menuData.generateData();

    if (targetWindow != window) {
        //do not show getAddins button in projection popout
        return actions;
    }

    if (getExtensibilityContext() && getExtensibilityContext().InClientStoreUrl) {
        actions.sectionProps.items.push(createDivider());
        actions.sectionProps.items.push(createAddinMarketplaceItem());
    }

    return actions;
}
