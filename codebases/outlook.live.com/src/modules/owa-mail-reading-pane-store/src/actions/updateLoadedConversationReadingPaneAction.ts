import { action } from 'satcheljs';
import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';

export default action(
    'UPDATE_LOADED_CONVERSATION_READING_PANE',
    (conversationId: string, nodeIdCollectionChanged: CollectionChange<string>) => {
        return {
            conversationId,
            nodeIdCollectionChanged,
        };
    }
);
