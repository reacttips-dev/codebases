import type Message from 'owa-service/lib/contract/Message';
import setAppendOnSendExtendedPropertiesToMessage from './setAppendOnSendExtendedPropertiesToMessage';
import removeExtendedPropertiesFromMessage from './removeExtendedPropertiesFromMessage';
import type { AddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
export default function tryUpdateExtendedPropertiesForAppendOnSend(
    viewState: AddinViewState,
    messageType: Message,
    isSend: boolean
) {
    if (isSend) {
        removeExtendedPropertiesFromMessage(['AppendOnSend'], messageType);
    } else if (viewState.appendOnSend && viewState.appendOnSend.length > 0) {
        // it is a save, not a send
        setAppendOnSendExtendedPropertiesToMessage(viewState.appendOnSend, messageType);
    }
}
