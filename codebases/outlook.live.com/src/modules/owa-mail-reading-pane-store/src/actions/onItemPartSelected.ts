import { action } from 'satcheljs';

export default action(
    'ON_ITEM_PART_SELECTED',
    (conversationNodeId: string, conversationId: string) => ({
        conversationNodeId,
        conversationId,
    })
);
