import type Message from 'owa-service/lib/contract/Message';
import type MapiPropertyType from 'owa-service/lib/contract/MapiPropertyType';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type ClassificationViewState from 'owa-mail-protection-types/lib/schema/classification/ClassificationViewState';
import { classificationPropertyMap } from './constants';

export default function stampMessageClassification(
    viewState: ClassificationViewState,
    item: Message
) {
    const { messageClassification } = viewState;
    if (!messageClassification) {
        return;
    }

    if (!item.ExtendedProperty) {
        item.ExtendedProperty = [];
    }

    Object.keys(messageClassification).forEach(key => {
        const propertyInfo = classificationPropertyMap[key];
        if (propertyInfo) {
            item.ExtendedProperty.push(
                extendedPropertyType({
                    ExtendedFieldURI: extendedPropertyUri({
                        PropertyId: propertyInfo.id,
                        DistinguishedPropertySetId: 'Common',
                        PropertyType: propertyInfo.propertyType as MapiPropertyType,
                    }),
                    Value: messageClassification[key],
                })
            );
        }
    });

    // isClassified, this is always true if a classification is selected
    // Simply stamping true for isClassified
    const isClassifiedPropertyInfo = classificationPropertyMap.IsClassified;
    item.ExtendedProperty.push(
        extendedPropertyType({
            ExtendedFieldURI: extendedPropertyUri({
                PropertyId: isClassifiedPropertyInfo.id,
                DistinguishedPropertySetId: 'Common',
                PropertyType: isClassifiedPropertyInfo.propertyType as MapiPropertyType,
            }),
            Value: 'true',
        })
    );
}
