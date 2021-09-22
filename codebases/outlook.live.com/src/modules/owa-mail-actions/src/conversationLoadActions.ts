import { action } from 'satcheljs';
import type { CollectionChange } from 'owa-mail-store';

export const conversationReadyToLoad = action(
    'CONVERSATION_READY_TO_LOAD',
    (conversationId: string, nodeIdCollectionChange?: CollectionChange<string>) => ({
        conversationId,
        nodeIdCollectionChange,
    })
);

export const updateAttachments = action('UPDATE_ATTACHMENTS');

export interface ItemMandatoryPropertiesCollectionChange {
    isReadChangedToUnread: string[];
}

export const updateItemMandatoryProperties = action(
    'UPDATE_ITEM_MANDATORY_PROPERTIES',
    (
        conversationId: string,
        nodeIdCollectionWithItemMandatoryPropertiesChanged: ItemMandatoryPropertiesCollectionChange
    ) => ({
        conversationId,
        nodeIdCollectionWithItemMandatoryPropertiesChanged,
    })
);
