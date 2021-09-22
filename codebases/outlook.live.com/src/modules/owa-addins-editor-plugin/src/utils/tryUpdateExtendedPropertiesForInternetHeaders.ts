import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import type Message from 'owa-service/lib/contract/Message';
import removeExtendedPropertiesFromMessage from './removeExtendedPropertiesFromMessage';
import setExtendedPropertiesToMessage from './setExtendedPropertiesToMessage';

export default function tryUpdateExtendedPropertiesForInternetHeaders(
    viewState: AddinViewState,
    messageType: Message
) {
    if (viewState.internetHeaders.size > 0) {
        setExtendedPropertiesToMessage(viewState.internetHeaders, messageType);
    }

    if (viewState.keysOfInternetHeadersToBeRemoved.length > 0) {
        removeExtendedPropertiesFromMessage(
            viewState.keysOfInternetHeadersToBeRemoved,
            messageType
        );
    }
}
