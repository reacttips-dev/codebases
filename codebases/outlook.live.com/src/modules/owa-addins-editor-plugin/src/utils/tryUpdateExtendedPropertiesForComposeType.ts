import removeExtendedPropertiesFromMessage from './removeExtendedPropertiesFromMessage';
import type {
    AddinViewState,
    ComposeType,
} from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type Message from 'owa-service/lib/contract/Message';

export default function tryUpdateExtendedPropertiesForComposeType(
    viewState: AddinViewState,
    messageType: Message,
    isSend: boolean
) {
    if (isSend) {
        removeExtendedPropertiesFromMessage(['ComposeType'], messageType);
    } else if (viewState.draftComposeType !== null) {
        // it is a save, not a send
        setComposeTypeExtendedPropertiesToMessage(viewState.draftComposeType, messageType);
    }
}

function setComposeTypeExtendedPropertiesToMessage(composeType: ComposeType, message: Message) {
    if (!message.ExtendedProperty) {
        message.ExtendedProperty = [];
    }
    message.ExtendedProperty.push(
        extendedPropertyType({
            Value: composeType,
            ExtendedFieldURI: extendedPropertyUri({
                DistinguishedPropertySetId: 'Common',
                PropertyName: 'ComposeType',
                PropertyType: 'String',
            }),
        })
    );
}
