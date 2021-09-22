import { createLazyOrchestrator } from 'owa-bundling';
import updateInternetMessageId from 'owa-mail-compose-actions/lib/actions/updateInternetMessageId';
import updatePendingNodeInternetMessageIdIfNeeded from '../actions/updatePendingNodeInternetMessageIdIfNeeded';

export const updateInternetMessageIdOrchestrator = createLazyOrchestrator(
    updateInternetMessageId,
    'updateInternetMessageIdClone',
    actionMessage => {
        const { conversationId, itemId, internetMessageId } = actionMessage;
        updatePendingNodeInternetMessageIdIfNeeded(conversationId, itemId, internetMessageId);
    }
);
