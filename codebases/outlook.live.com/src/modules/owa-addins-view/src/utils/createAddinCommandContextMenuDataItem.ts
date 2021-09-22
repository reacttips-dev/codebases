import ContextMenuDataItem from './ContextMenuDataItem';
import createAddinCommandContextMenuData from './createAddinCommandContextMenuData';
import type { AddinCommand } from 'owa-addins-store';
import { getClickHandler } from './contextMenuDataUtils';

export default function createAddinCommandContextMenuDataItem(addinCommand: AddinCommand) {
    const { Id, Label } = addinCommand.control;
    const item = new ContextMenuDataItem(Id, Label);
    if (addinCommand.isMenu) {
        item.subMenuData = createAddinCommandContextMenuData(Id, Label, addinCommand.subCommands);
    } else if (addinCommand.isActionable) {
        item.getClickHandler = getClickHandler(addinCommand);
    }

    // Remove null check after root causing https://o365exchange.visualstudio.com/DefaultCollection/Outlook%20Services/_workitems/edit/1279652
    item.iconUrl = addinCommand.control.Icon ? addinCommand.control.Icon.Size16Url : null;
    item.accessibilityText = addinCommand.control.Label;
    item.description = addinCommand.control.Supertip ? addinCommand.control.Supertip.Title : null;
    return item;
}
