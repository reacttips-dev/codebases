import {
    errorMessageMessageCanNotBeSent,
    moreDetailsNotificationLabel,
} from '../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import {
    InfoBarMessageViewState,
    InfoBarMessageSource,
    InfoBarMessageRank,
} from 'owa-info-bar/lib/schema/InfoBarMessageViewState';

export default function getDetailErrorInfobarHandler(
    message: string
): () => InfoBarMessageViewState {
    return function () {
        return {
            key: 'errorMessageErrorWithDetail',
            source: InfoBarMessageSource.Compose,
            rank: InfoBarMessageRank.Error,
            message: message,
            messageParts: [
                loc(errorMessageMessageCanNotBeSent),
                {
                    showDetailsText: loc(moreDetailsNotificationLabel),
                    hideDetailsText: null,
                    detailsElement: <span>{message}</span>,
                },
            ],
        };
    };
}
