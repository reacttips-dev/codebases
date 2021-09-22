import type SpotlightItem from '../store/schema/SpotlightItem';
import getStore from '../store/store';

export default function getSpotlightItemByRowKey(rowKey: string): SpotlightItem {
    const spotlightItems = getStore().spotlightItems;

    for (const spotlightItem of spotlightItems) {
        if (spotlightItem.rowKey === rowKey) {
            return spotlightItem;
        }
    }

    return null;
}
