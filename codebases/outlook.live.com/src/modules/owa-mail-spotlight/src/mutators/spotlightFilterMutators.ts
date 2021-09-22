import onSpotlightFilterLoaded from '../actions/onSpotlightFilterLoaded';
import type SpotlightItem from '../store/schema/SpotlightItem';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(onSpotlightFilterLoaded, () => {
    getStore().spotlightItems.map(
        (spotlightItem: SpotlightItem) => (spotlightItem.isAcknowledged = true)
    );
});
