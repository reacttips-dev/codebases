import createInfoBarMessageViewStateFactory from './createInfoBarMessageViewStateFactory';
import { getReadHostItemIndex } from 'owa-addins-core';
import type ItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemViewState';
import * as ReadInfoBarHandlers from 'owa-mail-reading-pane-store/lib/utils/infoBarHandlers';

export const addNotificationMessage = (viewState: ItemViewState) => (messageId: string) => {
    ReadInfoBarHandlers.infoBarAddHandler(viewState)(
        messageId,
        createInfoBarMessageViewStateFactory(
            getReadHostItemIndex(viewState.itemId),
            messageId,
            removeNotificationMessage(viewState)
        )
    );
};

export const removeNotificationMessage = (viewState: ItemViewState) => (messageId: string) => {
    ReadInfoBarHandlers.infoBarRemoveHandler(viewState)(messageId);
};

export const getNotificationMessageIds = (viewState: ItemViewState) => (): string[] => {
    return ReadInfoBarHandlers.infoBarGetIdsHandler(viewState)();
};
