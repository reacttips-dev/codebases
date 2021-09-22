import type { AddinCommandSurfaceItem } from 'owa-addins-types';

export default function convertToIContextualMenuItem(
    hostItemIndex: string,
    item: AddinCommandSurfaceItem
) {
    if (item.getClickHandler) {
        item.onClick = item.getClickHandler(hostItemIndex);
    } else if (item.sectionProps) {
        const items = item.sectionProps.items;
        items.forEach(menuItem => {
            convertToIContextualMenuItem(hostItemIndex, menuItem);
        });
    } else if (item.subMenuProps) {
        const items = item.subMenuProps.items;
        items.forEach(menuItem => {
            convertToIContextualMenuItem(hostItemIndex, menuItem);
        });
    }
}
