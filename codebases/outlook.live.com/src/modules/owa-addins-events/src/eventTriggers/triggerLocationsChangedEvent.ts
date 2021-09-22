import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import triggerAllApiEvents from '../triggerAllApiEvents';
import { getAdapter } from 'owa-addins-adapters';
import { createLocationDetails, LocationDetails } from 'owa-addins-apis-types';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { getComposeHostItemIndex } from 'owa-addins-store';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';

export function triggerLocationsChangedEvent(
    itemId: string,
    enhancedLocations: EnhancedLocation[]
) {
    const hostItemIndex = getComposeHostItemIndex(itemId);
    const adapter = getAdapter(hostItemIndex);
    if (adapter != null && adapter.mode === ExtensibilityModeEnum.AppointmentOrganizer) {
        const locationDetails: LocationDetails[] = enhancedLocations.map(createLocationDetails);
        triggerAllApiEvents(hostItemIndex, OutlookEventDispId.LOCATIONS_CHANGED_EVENT, () => {
            return { enhancedLocations: locationDetails };
        });
    }
}
