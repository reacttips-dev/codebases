import { createLazyOrchestrator } from 'owa-bundling';
import { conversationReadyToLoad } from 'owa-mail-actions/lib/conversationLoadActions';
import updateLoadedConversation from '../actions/updateLoadedConversation';

export const conversationReadyToLoadOrchestrator = createLazyOrchestrator(
    conversationReadyToLoad,
    'conversationReadyToLoadClone',
    actionMessage => {
        const { conversationId, nodeIdCollectionChange } = actionMessage;
        updateLoadedConversation(conversationId, nodeIdCollectionChange);
    }
);
