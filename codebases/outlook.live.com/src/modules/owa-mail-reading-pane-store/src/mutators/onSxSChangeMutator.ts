import store from '../store/Store';
import {
    onSxSReadingPaneChange,
    SxSConversationReadingPaneState,
    onBeforeSxSReadingPaneChange,
} from 'owa-sxs-store';
import { mutator } from 'satcheljs';

mutator(onSxSReadingPaneChange, actionMessage => {
    const { readingPaneState } = actionMessage;
    if (readingPaneState) {
        store.sxsItemId = (readingPaneState as SxSConversationReadingPaneState).conversationId
            ? (readingPaneState as SxSConversationReadingPaneState).conversationId?.Id
            : null;
    } else {
        store.sxsItemId = null;
    }
});

mutator(onBeforeSxSReadingPaneChange, actionMessage => {
    const { id } = actionMessage;
    store.sxsItemId = id;
});
