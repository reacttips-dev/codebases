import { selectMailStoreItemById } from 'owa-mail-store';

export default function checkForLocalItemIds(
    itemIdsToCheck: string[] | undefined,
    parentFolderId: string
): string | null {
    if (itemIdsToCheck) {
        for (let i = 0; i < itemIdsToCheck.length; i++) {
            if (parentFolderId) {
                const item = selectMailStoreItemById(itemIdsToCheck[i]);
                const isLocalItem = item?.ParentFolderId?.Id == parentFolderId;
                if (isLocalItem) {
                    return itemIdsToCheck[i];
                }
            }
        }
    }
    return null;
}
