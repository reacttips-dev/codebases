import type SpotlightItem from '../store/schema/SpotlightItem';
import getStore from '../store/store';

export default function getUnacknowledgedSpotlightCount(): number {
    return getStore().spotlightItems.filter((spotlightItem: SpotlightItem) => {
        return !spotlightItem.isAcknowledged;
    }).length;
}
