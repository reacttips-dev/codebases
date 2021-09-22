import { displayNewAppointmentForm } from './DisplayNewAppointmentFormAdapter';
import { displayNewMessageForm } from './DisplayNewMessageFormAdapter';
import { displayReplyForm } from './DisplayReplyFormAdapter';
import { getRecurrence, getSeriesId } from './ReadRecurrenceAdapter';
import { checkItemId } from '../CommonAdapters/CheckItemIdAdapter';
import { displayAppointmentForm } from '../CommonAdapters/DisplayAppointmentFormAdapter';
import { displayMessageForm } from '../CommonAdapters/DisplayMessageFormAdapter';
import { getAllInternetHeaders } from './ReadInternetHeadersAdapter';
import { isReadAddinPinned as isAddinPinned } from '../CommonAdapters/IsAddinPinnedAdapter';
import { getReadItemId } from '../CommonAdapters/ItemIdAdapter';
import { isRemoteItem, isSharedItemForRead } from '../CommonAdapters/SharedItemAdapter';
import { getSharedProperties } from '../CommonAdapters/SharedPropertiesAdapter';
import type { MessageReadAdapter } from 'owa-addins-core';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import { getFocusedItemPart } from 'owa-mail-reading-pane-store/lib/utils/focusedItemPartUtils';
import type Item from 'owa-service/lib/contract/Item';
import { wrapItemWithEwsIdGetter } from 'owa-addins-ews-id-wrapper';
import {
    addNotificationMessage,
    removeNotificationMessage,
    getNotificationMessageIds,
} from '../NotificationMessageAdapters/ReadNotificationMessageAdapter';
import {
    getCategoriesMailbox,
    addCategoriesMailbox,
    removeCategoriesMailbox,
    getCategoriesItem,
    addCategoriesItemRead,
    removeCategoriesItemRead,
} from '../CommonAdapters/CategoriesAdapter';
import { getAttachmentContent } from '../ReadAdapters/ReadAttachmentAdapter';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface ReadAdapterCreatorState {
    conversationReadingPaneViewState: ConversationReadingPaneViewState;
}

const isItemSelected = (
    viewState: ItemPartViewState,
    item: Item,
    state?: ReadAdapterCreatorState
) => (): boolean => {
    return viewState.isConversationItemPart
        ? getFocusedItemPart({
              conversationReadingPaneState: state.conversationReadingPaneViewState,
          }) == viewState
        : true;
};

const isInlineComposeOpen = (viewState: ItemPartViewState, item: Item) => (): boolean => {
    const conversationId = viewState.isConversationItemPart ? item.ConversationId?.Id : null;
    return !!findInlineComposeViewState(conversationId);
};

export let createMailReadAdapter = function createMailReadAdapter(
    item: Item,
    viewState: ItemPartViewState,
    state: ReadAdapterCreatorState = {
        conversationReadingPaneViewState: getConversationReadingPaneViewState(
            item?.ConversationId?.Id
        ),
    }
): MessageReadAdapter {
    return {
        getItem: isFeatureEnabled('fwk-immutable-ids')
            ? wrapItemWithEwsIdGetter(item)
            : () => Promise.resolve(item),
        getItemWithUnsafeIdsImmediate: () => item,
        getItemId: getReadItemId(item),
        addNotificationMessage: addNotificationMessage(viewState),
        removeNotificationMessage: removeNotificationMessage(viewState),
        getNotificationMessageIds: getNotificationMessageIds(viewState),
        mode: ExtensibilityModeEnum.MessageRead,
        displayMessageForm,
        displayNewMessageForm,
        displayNewAppointmentForm,
        displayReplyForm,
        displayAppointmentForm,
        checkItemId,
        isAddinPinned,
        isItemSelected: isItemSelected(viewState, item, state),
        isInlineComposeOpen: isInlineComposeOpen(viewState, item),
        isSharedItem: isSharedItemForRead(item),
        isRemoteItem,
        getSharedProperties: getSharedProperties(item),
        getRecurrence: getRecurrence(item),
        getSeriesId: getSeriesId(item),
        getAllInternetHeaders: getAllInternetHeaders(item),
        getAttachmentContent: getAttachmentContent(viewState),
        getCategoriesMailbox,
        addCategoriesMailbox,
        removeCategoriesMailbox,
        getCategoriesItem: getCategoriesItem(viewState),
        addCategoriesItemRead: addCategoriesItemRead(viewState),
        removeCategoriesItemRead: removeCategoriesItemRead(viewState),
    };
};

export default createMailReadAdapter;
