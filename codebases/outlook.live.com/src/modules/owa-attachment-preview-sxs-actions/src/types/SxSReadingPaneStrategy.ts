import type { ClientItemId } from 'owa-client-ids';

export enum SxSReadingPaneInitializeMethod {
    NoOp,
    AlwaysHidden,
    CopyMailReadingPaneContainer,
    LoadConversationReadingPane,
    LoadItemReadingPane,
}

type SxSReadingPaneStrategy =
    | SxSGenericReadingPaneStrategy
    | SxSConversationReadingPaneStrategy
    | SxSItemReadingPaneStrategy;

export default SxSReadingPaneStrategy;

export interface SxSGenericReadingPaneStrategy {
    method:
        | SxSReadingPaneInitializeMethod.NoOp
        | SxSReadingPaneInitializeMethod.AlwaysHidden
        | SxSReadingPaneInitializeMethod.CopyMailReadingPaneContainer;
}

export interface SxSConversationReadingPaneStrategy {
    method: SxSReadingPaneInitializeMethod.LoadConversationReadingPane;
    conversationId: ClientItemId;
    conversationSubject: string;
    conversationCategories: string[];
    itemIdToScrollTo?: string;
}

export interface SxSItemReadingPaneStrategy {
    method: SxSReadingPaneInitializeMethod.LoadItemReadingPane;
    itemId: ClientItemId;
}
