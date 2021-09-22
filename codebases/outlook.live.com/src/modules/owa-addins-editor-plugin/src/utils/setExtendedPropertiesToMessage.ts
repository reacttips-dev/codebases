import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type Message from 'owa-service/lib/contract/Message';
import type { ObservableMap } from 'mobx';

export default function setExtendedPropertiesToMessage(
    internetHeaders: ObservableMap<string, string>,
    message: Message
) {
    if (!message.ExtendedProperty) {
        message.ExtendedProperty = [];
    }

    for (const key of internetHeaders.keys()) {
        message.ExtendedProperty.push(
            extendedPropertyType({
                Value: internetHeaders.get(key),
                ExtendedFieldURI: extendedPropertyUri({
                    DistinguishedPropertySetId: 'InternetHeaders',
                    PropertyName: key,
                    PropertyType: 'String',
                }),
            })
        );
    }
}
