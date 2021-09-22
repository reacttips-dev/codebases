import ContextMenuDataItem from './ContextMenuDataItem';
import createAddinCommandContextMenuData from './createAddinCommandContextMenuData';
import type { Addin, IAddinCommand } from 'owa-addins-store';
import { getClickHandler } from './contextMenuDataUtils';
import {
    canExecute,
    getSupertipTitle,
    getAccessibilityText,
    getFirstCommand,
    isSingleCommand,
    needShowMenu,
} from '../utils/entryPointOperations/AddinChecker';

export default function createAddinContextMenuDataItem(addin: Addin) {
    const item = new ContextMenuDataItem(addin.Id, addin.DisplayName);
    if (needShowMenu(addin)) {
        if (isSingleCommand(addin)) {
            item.subMenuData = createAddinCommandContextMenuData(
                addin.Id,
                addin.DisplayName,
                getFirstCommand(addin).subCommands
            );
        } else {
            const addinCommands = [...addin.AddinCommands.values()] as IAddinCommand[];
            item.subMenuData = createAddinCommandContextMenuData(
                addin.Id,
                addin.DisplayName,
                addinCommands
            );
        }
    } else if (canExecute(addin)) {
        item.getClickHandler = getClickHandler(getFirstCommand(addin));
    }

    item.description = getSupertipTitle(addin);
    item.accessibilityText = getAccessibilityText(addin);
    item.iconUrl = addin.IconUrl;
    return item;
}
