import type Message from 'owa-service/lib/contract/Message';

export default function removeExtendedPropertiesFromMessage(keys: string[], message: Message) {
    if (message.ExtendedProperty) {
        let keyIndex = keys.length;
        while (keyIndex-- && message.ExtendedProperty.length > 0) {
            let propertyIndex = message.ExtendedProperty.length;
            while (propertyIndex--) {
                if (
                    keys[keyIndex] ===
                    message.ExtendedProperty[propertyIndex].ExtendedFieldURI.PropertyName
                ) {
                    message.ExtendedProperty.splice(propertyIndex, 1);
                    break;
                }
            }
        }
    }
}
