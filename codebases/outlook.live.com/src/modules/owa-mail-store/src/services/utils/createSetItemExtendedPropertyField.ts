import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import message from 'owa-service/lib/factory/message';
import type SetItemField from 'owa-service/lib/contract/SetItemField';
import setItemField from 'owa-service/lib/factory/setItemField';

export default function createSetItemExtendedPropertyField(
    extendedProperty: ExtendedPropertyType
): SetItemField {
    return setItemField({
        Path: extendedPropertyUri(extendedProperty.ExtendedFieldURI),
        Item: message({ ExtendedProperty: [extendedPropertyType(extendedProperty)] }),
    });
}
