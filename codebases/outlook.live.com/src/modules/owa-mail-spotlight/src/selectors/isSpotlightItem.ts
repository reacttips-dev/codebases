import getStore from '../store/store';

export default function isSpotlightItem(params: {
    itemId?: string;
    conversationId?: string;
    rowKey?: string;
}): boolean {
    const { itemId, conversationId, rowKey } = params;

    return getStore().spotlightItems.some(
        spotlightItem =>
            (itemId && spotlightItem.itemId === itemId) ||
            (conversationId && spotlightItem.conversationId === conversationId) ||
            (rowKey && spotlightItem.rowKey === rowKey)
    );
}
