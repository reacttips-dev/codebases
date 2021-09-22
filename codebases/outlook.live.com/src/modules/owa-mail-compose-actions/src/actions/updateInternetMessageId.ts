import { action } from 'satcheljs';

export default action(
    'updateInternetMessageId',
    (conversationId: string, itemId: string, internetMessageId: string) => ({
        conversationId,
        itemId,
        internetMessageId,
    })
);
