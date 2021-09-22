import type SpotlightItem from '../store/schema/SpotlightItem';
import getStore from '../store/store';

export default function getSpotlightItem(params: {
    itemId?: string;
    conversationId?: string;
    rowKey?: string;
}): SpotlightItem | null {
    const { itemId, conversationId, rowKey } = params;

    const filteredSpotlightItems = getStore().spotlightItems.filter(
        spotlightItem =>
            (itemId && spotlightItem.itemId === itemId) ||
            (conversationId && spotlightItem.conversationId === conversationId) ||
            (rowKey && spotlightItem.rowKey === rowKey)
    );

    return filteredSpotlightItems.length > 0 ? filteredSpotlightItems[0] : null;
}
