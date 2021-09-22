import type DeleteItemField from 'owa-service/lib/contract/DeleteItemField';
import deleteItemField from 'owa-service/lib/factory/deleteItemField';
import type DistinguishedPropertySet from 'owa-service/lib/contract/DistinguishedPropertySet';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export default function createDeleteItemExtendedPropertyField(
    propertySet: DistinguishedPropertySet,
    propertyName: string
): DeleteItemField {
    return deleteItemField({
        Path: extendedPropertyUri({
            DistinguishedPropertySetId: propertySet,
            PropertyName: propertyName,
            PropertyType: 'String',
        }),
    });
}
