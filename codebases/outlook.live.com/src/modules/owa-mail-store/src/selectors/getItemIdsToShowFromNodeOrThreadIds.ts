import getItemForMailList from './getItemForMailList';

export default function getItemIdsToShowFromNodeOrThreadIds(
    ids: string[],
    isFirstLevelExpansion: boolean
): string[] {
    const itemIds = [];
    for (const id of ids) {
        const item = getItemForMailList(id, isFirstLevelExpansion);

        // It is possible item is null when it is not in the store or the user
        // is hiding deleted items
        if (item) {
            itemIds.push(item.ItemId.Id);
        }
    }
    return itemIds;
}
