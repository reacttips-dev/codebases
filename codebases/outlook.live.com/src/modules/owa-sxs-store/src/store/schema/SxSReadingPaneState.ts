import type { ClientItemId } from 'owa-client-ids';

export enum SxSReadingPaneMode {
    ConversationReadingPane,
    ItemReadingPane,
}

type SxSReadingPaneState = SxSConversationReadingPaneState | SxSItemReadingPaneState;

export default SxSReadingPaneState;

export interface SxSConversationReadingPaneState {
    mode: SxSReadingPaneMode.ConversationReadingPane;
    conversationId: ClientItemId;
    conversationSubject: string;
    conversationCategories: string[];
}

export interface SxSItemReadingPaneState {
    mode: SxSReadingPaneMode.ItemReadingPane;
    itemId: ClientItemId;
    itemReadingPaneViewState: any;
}
