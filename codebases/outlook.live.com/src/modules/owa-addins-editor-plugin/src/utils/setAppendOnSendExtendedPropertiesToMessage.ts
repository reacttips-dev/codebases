import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type Message from 'owa-service/lib/contract/Message';
import type { AppendOnSend } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

export default function setAppendOnSendExtendedPropertiesToMessage(
    appendOnSend: AppendOnSend[],
    message: Message
) {
    if (!message.ExtendedProperty) {
        message.ExtendedProperty = [];
    }
    message.ExtendedProperty.push(
        extendedPropertyType({
            Value: JSON.stringify(appendOnSend),
            ExtendedFieldURI: extendedPropertyUri({
                DistinguishedPropertySetId: 'Common',
                PropertyName: 'AppendOnSend',
                PropertyType: 'String',
            }),
        })
    );
}
