import { createLazyOrchestrator } from 'owa-bundling';
import { updateAttachments } from 'owa-mail-actions/lib/conversationLoadActions';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import initializeAttachmentsForConversationWell from '../actions/initializeAttachmentsForConversationWell';

export const updateAttachmentsOrchestrator = createLazyOrchestrator(
    updateAttachments,
    'updateAttachments',
    actionMessage => {
        const conversationReadingPaneViewState = getConversationReadingPaneViewState();
        initializeAttachmentsForConversationWell(conversationReadingPaneViewState, true);
    }
);
