import type SecondaryReadingPaneTabData from './SecondaryReadingPaneTabData';

export enum TabType {
    Primary,
    OverflowMenu,
    SecondaryReadingPane,
    MailCompose,
    FloatingChat,
    SxS,
    CalendarCompose,
}

export const enum TabState {
    Hidden,
    Minimized,
    Active,
    Popout,
}

interface TabViewStateBase {
    id: string;
    state: TabState;
    startTime?: number;
    parentTabId?: string;
    blink: boolean;
    sxsId: string;
}

export interface PrimaryReadingPaneTabViewState extends TabViewStateBase {
    type: TabType.Primary;
}

export interface SecondaryReadingPaneTabViewState extends TabViewStateBase {
    type: TabType.SecondaryReadingPane;
    data: SecondaryReadingPaneTabData;
}

export interface OverflowTabViewState extends TabViewStateBase {
    type: TabType.OverflowMenu;
    data: TabViewState[];
}

export interface CalendarComposeTabViewState extends TabViewStateBase {
    type: TabType.CalendarCompose;
    data: string /* composeId */;
}

export interface MailComposeTabViewState extends TabViewStateBase {
    type: TabType.MailCompose;
    data: string /* composeId */;
    /**
     * Tab Id of parent projection item reading pane.
     * When specified, it can only be used as inline compose for the given item reading pane tab.
     * All other reading pane tabs (conversation RP, item RP with other tab id) will ignore it.
     */
    projectionRPTabId: string;
}

export interface FloatingChatTabViewState extends TabViewStateBase {
    type: TabType.FloatingChat;
    data: string /* conversationId */;
    isChatActive: boolean;
}

export interface SxSTabViewState extends TabViewStateBase {
    type: TabType.SxS;
}

type TabViewState =
    | PrimaryReadingPaneTabViewState
    | SecondaryReadingPaneTabViewState
    | OverflowTabViewState
    | MailComposeTabViewState
    | FloatingChatTabViewState
    | SxSTabViewState
    | CalendarComposeTabViewState;

export default TabViewState;
