import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

/** Extended property that propagates necessary metadata for the creation of flex events */
export const FlexEventsMetadataExtendedProperty: ExtendedPropertyUri = extendedPropertyUri({
    DistinguishedPropertySetId: 'Common',
    PropertyName: 'FlexEventsMetadata',
    PropertyType: 'String',
});
