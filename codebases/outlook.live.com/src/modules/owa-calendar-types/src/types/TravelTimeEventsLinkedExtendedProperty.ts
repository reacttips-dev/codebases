import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import { getExtendedPropertyUri } from 'owa-service/lib/ServiceRequestUtils';

/** Extended property that indicates whether an event has travel time events linked to them */
export const TravelTimeEventsLinkedExtendedProperty: ExtendedPropertyUri = getExtendedPropertyUri(
    '6ed8da90-450b-101b-98da-00aa003f1305',
    'TravelTimeEventsLinked',
    'Boolean'
);
