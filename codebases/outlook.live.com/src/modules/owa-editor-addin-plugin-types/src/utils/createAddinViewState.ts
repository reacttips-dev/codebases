import type Message from 'owa-service/lib/contract/Message';
import {
    ComposeType,
    AppendOnSend,
    AddinViewState,
    LastFocusedControl,
    SessionStoreSchema,
} from './AddinViewState';
import type Item from 'owa-service/lib/contract/Item';
import { ObservableMap } from 'mobx';

export function createAddinViewState(
    appendOnSend?: AppendOnSend[],
    draftComposeType?: ComposeType
): AddinViewState {
    return {
        appendOnSend: appendOnSend ? appendOnSend : [],
        draftComposeType: draftComposeType,
        lastFocusedControl: LastFocusedControl.Other,
        subject: {
            selectionStart: -1,
            selectionEnd: -1,
        },
        internetHeaders: new ObservableMap<string, string>(),
        keysOfInternetHeadersToBeRemoved: [],
        isAutorunComposeEventTriggered: false,
        //Key for the map is addIn GUID, which is unique for every addIn
        sessionStore: new ObservableMap<string, SessionStoreSchema>(),
    };
}

export function getAppendOnSendFromExtendedProperty(message: Message): AppendOnSend[] {
    const appendOnSendExtendedProperty = getExtendedProperty(message, 'AppendOnSend');
    let appendOnSend: AppendOnSend[] = [];
    if (appendOnSendExtendedProperty) {
        try {
            appendOnSend = JSON.parse(appendOnSendExtendedProperty.Value);
        } catch {
            appendOnSend = [];
        }
    }

    return appendOnSend;
}

export function getComposeTypeFromExtendedProperty(message: Message): ComposeType {
    const composeTypeExtendedProperty = getExtendedProperty(message, 'ComposeType');
    let draftComposeType: string = '',
        operation: ComposeType = ComposeType.Unknown;
    if (composeTypeExtendedProperty) {
        draftComposeType = composeTypeExtendedProperty.Value;

        if (draftComposeType.toLowerCase() == 'reply') {
            operation = ComposeType.Reply;
        } else if (draftComposeType.toLowerCase() == 'forward') {
            operation = ComposeType.Forward;
        } else {
            operation = ComposeType.New;
        }
    }
    return operation;
}

export function getExtendedProperty(item: Item, name: string) {
    if (!item || !item.ExtendedProperty) {
        return null;
    }

    for (let i = 0; i < item.ExtendedProperty.length; i++) {
        const extendedProperty = item.ExtendedProperty[i];
        let propertyName;
        if (extendedProperty?.ExtendedFieldURI) {
            propertyName = extendedProperty.ExtendedFieldURI.PropertyName;
        }
        if (name && propertyName == name) {
            return extendedProperty;
        }
    }

    return null;
}
