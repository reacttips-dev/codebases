import { closeItem } from './CloseAdapter';
import { getConversationId } from './ConversationIdAdapter';
import { getFrom } from './FromAdapter';
import { addRecipients, getRecipients, setRecipients } from './RecipientsAdapter';
import saveItem from './saveItem';
import { getSelectedData, setSelectedData } from './SelectedDataAdapter';
import { getSubject, setSubject } from './SubjectAdapter';
import {
    getCategoriesMailbox,
    addCategoriesMailbox,
    removeCategoriesMailbox,
} from '../CommonAdapters/CategoriesAdapter';
import { checkItemId } from '../CommonAdapters/CheckItemIdAdapter';
import { displayAppointmentForm } from '../CommonAdapters/DisplayAppointmentFormAdapter';
import { displayMessageForm } from '../CommonAdapters/DisplayMessageFormAdapter';
import { isComposeAddinPinned as isAddinPinned } from '../CommonAdapters/IsAddinPinnedAdapter';
import { getComposeItemId as getItemId } from '../CommonAdapters/ItemIdAdapter';
import { isRemoteItem, isSharedItemForCompose } from '../CommonAdapters/SharedItemAdapter';
import { getSharedPropertiesForCompose } from '../CommonAdapters/SharedPropertiesAdapter';
import type { MessageComposeAdapter } from 'owa-addins-core';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import type { ComposeViewState } from 'owa-mail-compose-store';
import {
    addFileAttachment,
    addItemAttachment,
    removeAttachment,
    getAttachments,
    addFileAttachmentFromBase64,
    getAttachmentContent,
} from './AttachmentAdapter';
import {
    addNotificationMessage,
    removeNotificationMessage,
    getNotificationMessageIds,
} from '../NotificationMessageAdapters/ComposeNotificationMessageAdapter';
import {
    getBody,
    getBodyType,
    prependBody,
    setBody,
    setBodySelectedData,
    appendOnSend,
} from './BodyAdapter';
import {
    setSessionDataState,
    getSessionDataState,
    getAllSessionDataState,
    clearSessionDataState,
    removeSessionDataState,
} from './SessionDataAdapter';
import {
    setInternetHeadersAdapter as setInternetHeaders,
    removeInternetHeadersAdapter as removeInternetHeaders,
    getComposeInternetHeaders as getInternetHeaders,
} from './InternetHeadersAdapter';
import {
    getComposeTypeAndCoercionType,
    setSignature,
    isClientSignatureEnabled,
    disableClientSignature,
} from './SignatureAdapter';

export default function createMailComposeAdapter(
    viewState: ComposeViewState
): MessageComposeAdapter {
    return {
        getRecipients: getRecipients(viewState),
        setRecipients: setRecipients(viewState),
        addRecipients: addRecipients(viewState),
        getSubject: getSubject(viewState),
        setSubject: setSubject(viewState),
        getItemId: getItemId(viewState),
        getConversationId: getConversationId(viewState),
        getBody: getBody(viewState),
        setBody: setBody(viewState),
        getBodyType: getBodyType(viewState),
        prependBody: prependBody(viewState),
        getSelectedData: getSelectedData(viewState),
        setSelectedData: setSelectedData(viewState),
        setBodySelectedData: setBodySelectedData(viewState),
        mode: ExtensibilityModeEnum.MessageCompose,
        saveItem: saveItem(viewState),
        addNotificationMessage: addNotificationMessage(viewState),
        removeNotificationMessage: removeNotificationMessage(viewState),
        getNotificationMessageIds: getNotificationMessageIds(viewState),
        close: closeItem(viewState),
        checkItemId,
        displayMessageForm,
        displayAppointmentForm,
        addItemAttachment: addItemAttachment(viewState),
        addFileAttachment: addFileAttachment(viewState),
        addFileAttachmentFromBase64: addFileAttachmentFromBase64(viewState),
        removeAttachment: removeAttachment(viewState),
        getAttachments: getAttachments(viewState),
        getAttachmentContent: getAttachmentContent(viewState),
        isAddinPinned,
        isSharedItem: isSharedItemForCompose(viewState),
        getSharedProperties: getSharedPropertiesForCompose(viewState),
        isRemoteItem,
        getFrom: getFrom(viewState),
        getInternetHeaders: getInternetHeaders(viewState),
        setInternetHeaders: setInternetHeaders(viewState),
        removeInternetHeaders: removeInternetHeaders(viewState),
        appendOnSend: appendOnSend(viewState),
        getCategoriesMailbox,
        addCategoriesMailbox,
        removeCategoriesMailbox,
        getComposeTypeAndCoercionType: getComposeTypeAndCoercionType(viewState),
        setSignature: setSignature(viewState),
        isClientSignatureEnabled: isClientSignatureEnabled(),
        disableClientSignature,
        setSessionDataState: setSessionDataState(viewState),
        getSessionDataState: getSessionDataState(viewState),
        getAllSessionDataState: getAllSessionDataState(viewState),
        clearSessionDataState: clearSessionDataState(viewState),
        removeSessionDataState: removeSessionDataState(viewState),
    };
}
