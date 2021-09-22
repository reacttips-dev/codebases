import type Item from 'owa-service/lib/contract/Item';

export function isItemRepliedOrForwarded(item: Item) {
    const iconIndex = item.IconIndex ?? '';
    const iconIndexString = iconIndex.toString().toLowerCase();
    return iconIndexString.indexOf('replied') > -1 || iconIndexString.indexOf('forwarded') > -1;
}
