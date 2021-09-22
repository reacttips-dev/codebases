import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

/** Extended property that contains the collaborative space details */
export const CollabSpaceExtendedProperty: ExtendedPropertyUri = extendedPropertyUri({
    DistinguishedPropertySetId: 'PublicStrings',
    PropertyName: 'MeetingAgenda',
    PropertyType: 'String',
});
