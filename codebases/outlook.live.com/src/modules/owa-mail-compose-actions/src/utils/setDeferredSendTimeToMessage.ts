import type Message from 'owa-service/lib/contract/Message';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import { getISOString, OwaDate } from 'owa-datetime';

// Pulled out of Substrate's WellKnownProperties list.
const DEFERRED_SEND_TIME_PROPERTYTAG = '0x3FEF';

export default function setDeferredSendTimeToMessage(
    deferredSendTime: OwaDate | null | undefined,
    message: Message
) {
    if (deferredSendTime) {
        const extendedProperty = extendedPropertyType({
            Value: getISOString(deferredSendTime),
            ExtendedFieldURI: extendedPropertyUri({
                PropertyTag: DEFERRED_SEND_TIME_PROPERTYTAG,
                PropertyType: 'SystemTime',
            }),
        });

        if (message.ExtendedProperty) {
            message.ExtendedProperty.push(extendedProperty);
        } else {
            message.ExtendedProperty = [extendedProperty];
        }
    }
}
