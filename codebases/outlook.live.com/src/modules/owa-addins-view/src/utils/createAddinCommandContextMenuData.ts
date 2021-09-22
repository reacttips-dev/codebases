import ContextMenuData from './ContextMenuData';
import createAddinCommandContextMenuDataItem from './createAddinCommandContextMenuDataItem';
import type { AddinCommand, IAddinCommand } from 'owa-addins-store';

export default function createAddinCommandContextMenuData(
    id: string,
    displayName: string,
    addinCommands: IAddinCommand[]
): ContextMenuData {
    const data = new ContextMenuData(id, displayName);
    for (const command of addinCommands) {
        data.addItem(createAddinCommandContextMenuDataItem(command as AddinCommand));
    }
    return data;
}
