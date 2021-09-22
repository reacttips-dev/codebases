import type { ObservableMap } from 'mobx';

export enum CoercionType {
    Text = 0,
    Html = 3,
}
export interface AppendOnSend {
    txt: string;
    typ: CoercionType;
    id: string;
}

export const enum ComposeType {
    Unknown = 'unknown',
    New = 'newMail',
    Reply = 'reply',
    Forward = 'forward',
}

export const enum LastFocusedControl {
    Other,
    SubjectLine,
    Editor,
}

export interface SubjectViewState {
    selectionStart: number;
    selectionEnd: number;
}

export interface SessionStoreSchema {
    size: number;
    dataStore: ObservableMap<string, string>;
}

export interface AddinViewState {
    appendOnSend?: AppendOnSend[];
    draftComposeType?: ComposeType;
    lastFocusedControl: LastFocusedControl;
    subject: SubjectViewState;
    internetHeaders: ObservableMap<string, string>;
    keysOfInternetHeadersToBeRemoved: string[];
    isAutorunComposeEventTriggered: boolean;
    sessionStore: ObservableMap<string, SessionStoreSchema>;
}
