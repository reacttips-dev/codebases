import type SpotlightItem from '../store/schema/SpotlightItem';
import { action } from 'satcheljs';

export default action(
    'onSpotlightItemsFetched',
    (spotlightItems: SpotlightItem[], isConversationView: boolean, requestStartTime: number) => ({
        spotlightItems,
        isConversationView,
        requestStartTime,
    })
);
