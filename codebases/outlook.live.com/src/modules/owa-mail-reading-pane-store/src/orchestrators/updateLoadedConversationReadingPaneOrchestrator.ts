import { orchestrator } from 'satcheljs';
import updateLoadedConversationReadingPaneAction from '../actions/updateLoadedConversationReadingPaneAction';
import updateLoadedConversationReadingPane from '../actions/updateLoadedConversationReadingPane';

export default orchestrator(updateLoadedConversationReadingPaneAction, actionMessage => {
    updateLoadedConversationReadingPane(
        actionMessage.conversationId,
        actionMessage.nodeIdCollectionChanged
    );
});
export type { default as CollectionChange } from 'owa-mail-store/lib/store/schema/CollectionChange';
