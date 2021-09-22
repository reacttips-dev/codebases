import { getConversationItemsRelationMap } from './conversationRelationMapUtils';
import type ParentChildRelation from '../schema/ParentChildRelation';
import { mailStore } from 'owa-mail-store';
import type Message from 'owa-service/lib/contract/Message';

async function getAncestorsOfMessageIncludingCurrentItem(
    parentFolderId: string,
    conversationId: string,
    itemId: string
): Promise<string[]> {
    // Add the current itemId to the ancestor ids
    const ancestorIds: string[] = [itemId];
    const relationMap = await getConversationItemsRelationMap(conversationId);

    if (relationMap) {
        const message = mailStore.items.get(itemId) as Message;
        if (message?.InternetMessageId) {
            const relation: ParentChildRelation | undefined = relationMap.get(
                message.InternetMessageId
            );

            // Get the parent internet message id and start filling the ancestor ids
            let currentImId: string | undefined = relation?.parentImId;

            while (currentImId) {
                const currentRelation = relationMap.get(currentImId);

                if (currentRelation) {
                    currentRelation.itemIds.forEach((currentItemId: string) => {
                        // Only return local items
                        const item = mailStore.items.get(currentItemId);
                        if (!parentFolderId || item?.ParentFolderId?.Id == parentFolderId) {
                            ancestorIds.push(currentItemId);
                        }
                    });
                    currentImId = currentRelation.parentImId;
                } else {
                    currentImId = undefined;
                }
            }
        }
    }

    return ancestorIds;
}

export default getAncestorsOfMessageIncludingCurrentItem;
