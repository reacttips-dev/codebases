import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

/** Extended property that holds the value for appendOnSend */
export const IsAppendOnSendExtendedProperty: ExtendedPropertyUri = extendedPropertyUri({
    DistinguishedPropertySetId: 'Common',
    PropertyName: 'AppendOnSend',
    PropertyType: 'String',
});
