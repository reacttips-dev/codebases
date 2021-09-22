import createInfoBarMessageViewStateFactory from './createInfoBarMessageViewStateFactory';
import { getComposeHostItemIndex } from 'owa-addins-core';
import type { ComposeViewState } from 'owa-mail-compose-store';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';

export const addNotificationMessage = (viewState: ComposeViewState) => (messageId: string) => {
    addInfoBarMessage(
        viewState,
        messageId,
        createInfoBarMessageViewStateFactory(
            getComposeHostItemIndex(viewState.composeId),
            messageId,
            removeNotificationMessage(viewState)
        )
    );
};

export const removeNotificationMessage = (viewState: ComposeViewState) => (messageId: string) => {
    removeInfoBarMessage(viewState, [messageId]);
};

export const getNotificationMessageIds = (viewState: ComposeViewState) => (): string[] => {
    return viewState.infoBarIds;
};
