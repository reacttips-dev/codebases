import createItemIdForRequest from './createItemIdForRequest';
import isSendAsAliasEnabled from 'owa-proxy-address-option/lib/utils/isSendAsAliasEnabled';
import getAddSmimePropertiesRequestObject from './getAddSmimePropertiesRequestObject';
import getDataUriCount from './getDataUriCount';
import getRecipientsFromWellViewState from './getRecipientsFromWellViewState';
import removeSrcAttributeFromInlineImages from './removeSrcAttributeFromInlineImages';
import setFromInfoToMessage from './setFromInfoToMessage';
import setDeferredSendTimeToMessage from './setDeferredSendTimeToMessage';
import setFromInfoToPost from './setFromInfoToPost';
import tryUpdateExtendedPropertiesForAppendOnSend from 'owa-addins-editor-plugin/lib/utils/tryUpdateExtendedPropertiesForAppendOnSend';
import tryUpdateExtendedPropertiesForInternetHeaders from 'owa-addins-editor-plugin/lib/utils/tryUpdateExtendedPropertiesForInternetHeaders';
import tryUpdateExtendedPropertiesForComposeType from 'owa-addins-editor-plugin/lib/utils/tryUpdateExtendedPropertiesForComposeType';
import isGroupComposeViewState from 'owa-mail-compose-store/lib/utils/isGroupComposeViewState';
import { setWasclUrls } from './wasclUtils';
import clearKeysOfInternetHeadersToBeRemoved from 'owa-addins-editor-plugin/lib/actions/clearKeysOfInternetHeadersToBeRemoved';
import updateComposeItemId from '../actions/updateComposeItemId';
import updateInternetMessageId from '../actions/updateInternetMessageId';
import createAppendOnSendBlock from '../utils/createAppendOnSendBlock';
import { lazyGetAllValidAttachments } from 'owa-attachment-well-data';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ARCHIVE_FOLDERS_TREE_TYPE, SHARED_FOLDERS_TREE_TYPE } from 'owa-folders-constants';
import { getGroupMailboxInfo } from 'owa-group-common';
import { getDocLinks } from 'owa-link-data/lib/utils/getDocLinks';
import { format, isCurrentCultureRightToLeft } from 'owa-localize';
import stampCLPLabelInExtendedProperty from 'owa-mail-protection/lib/utils/clp/stampCLPLabelInExtendedProperty';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import stampMessageClassification from 'owa-mail-protection/lib/utils/classification/stampMessageClassification';
import { createItem } from 'owa-mail-create-item-service';
import createResponseFromModernGroup from 'owa-mail-store/lib/services/createResponseFromModernGroupItem';
import postGroupItem from 'owa-mail-store/lib/services/postGroupItem';
import PostUnifiedGroupItem from 'owa-mail-store/lib/services/PostUnifiedGroupItem';
import sendOrSaveMessageService from 'owa-mail-store/lib/services/sendOrSaveMessageService';
import checkIfResponseSuccess from 'owa-service-utils/lib/checkIfResponseSuccess';
import { getStore } from 'owa-mail-store/lib/store/Store';
import { getDlpInformationFromViewState } from 'owa-policy-tips/lib/utils/getDlpInformationFromViewState';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type DocLink from 'owa-service/lib/contract/DocLink';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type Message from 'owa-service/lib/contract/Message';
import type PostItem from 'owa-service/lib/contract/PostItem';
import type PostUnifiedGroupItemResponse from 'owa-service/lib/contract/PostUnifiedGroupItemResponse';
import getIRMDataBeforeSending from 'owa-mail-protection/lib/utils/rms/getIRMDataBeforeSending';
import approveRequestItem from 'owa-service/lib/factory/approveRequestItem';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import itemId from 'owa-service/lib/factory/itemId';
import message from 'owa-service/lib/factory/message';
import postItem from 'owa-service/lib/factory/postItem';
import rejectRequestItem from 'owa-service/lib/factory/rejectRequestItem';
import replyAllToItem from 'owa-service/lib/factory/replyAllToItem';
import replyToItem from 'owa-service/lib/factory/replyToItem';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import SmimeBccForkingMode from 'owa-smime-types/lib/schema/SmimeBccForkingMode';
import { CANCEL_SMIME_SEND_ERROR_MESSAGE } from 'owa-smime/lib/utils/constants';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { isItemClassSmime } from 'owa-smime/lib/utils/smimeItemClassUtils';
import { lazyLoadAtMentionsData } from 'owa-editor-mentions-picker-plugin';
import stampOriginalSmtpFromAddress from './stampOriginalSmtpFromAddress';
import {
    ComposeViewState,
    ComposeOperation,
    PublicFolderComposeViewState,
} from 'owa-mail-compose-store';
import {
    lazyGetSmimeAttachmentsForRequest,
    lazyTryAddSmimeProperties,
    lazyUpdateSmimeAttachmentIds,
} from 'owa-smime';
import createItemViaGraphQL, { isSupportedOperation } from './createItemViaGraphQL';
import sendOrSaveViaGraphQL from './sendOrSaveViaGraphQL';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type UpdateItemResponse from 'owa-service/lib/contract/UpdateItemResponse';
import trySaveMessage from '../actions/trySaveMessage';

const HTML_WRAPPER =
    '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<style type="text/css" style="display:none;"> P {{margin-top:0;margin-bottom:0;}} </style>' +
    '</head><body dir="{0}">{1}</body></html>';

const ITEM_CLASS_NOTE = 'IPM.Note';

export interface CustomError extends Error {
    isAsyncSend?: boolean;
    showErrorToUser?: boolean;
    messageText?: string;
}

function getPostForRequest(viewState: ComposeViewState): PostItem {
    let bodyValue = viewState.content;
    let dataUriCount = 0;

    if (viewState.bodyType == 'HTML') {
        const textDirection = getTextDirection(viewState);
        bodyValue = removeSrcAttributeFromInlineImages(bodyValue);
        dataUriCount = getDataUriCount(bodyValue);
        bodyValue = format(HTML_WRAPPER, textDirection, bodyValue);
    }

    const body = bodyContentType({ BodyType: viewState.bodyType, Value: bodyValue });
    body.DataUriCount = dataUriCount;

    let postType: PostItem;

    const commonPostFields: Partial<PostItem> = {
        Subject: viewState.subject || '',
        Importance: viewState.importance,
        Sensitivity: viewState.sensitivity,
    };

    postType = postItem({
        ...commonPostFields,
        Body: body,
    });

    if (viewState.itemId) {
        postType.ItemId = viewState.itemId;
    }

    if (viewState.fromViewState) {
        setFromInfoToPost(viewState.fromViewState, postType);
    }
    return postType;
}

/**
 * For non S/MIME mails, If there are attachments only on client
 * attach them now.
 * Scenario: Forwarding an S/MIME mail with attachments when
 * 'Always show From' setting is enabled. In that case,
 * forwarding mail is a non-S/MIME with attachments only on client.
 */
export const tryAddSmimeAttachmentsInRequest = async (
    viewState: ComposeViewState
): Promise<AttachmentType[]> => {
    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
        // For S/MIME compose, attachments are never saved on server.
        return null;
    }

    const smimeAttachments = (await lazyGetAllValidAttachments.import())(
        viewState.attachmentWell,
        viewState.content,
        viewState.bodyType,
        true /* filterSmimeAttachment */
    );

    return smimeAttachments?.length
        ? (await lazyGetSmimeAttachmentsForRequest.import())(smimeAttachments)
        : null;
};

export function getMessageForRequest(viewState: ComposeViewState, isSend?: Boolean): Message {
    let bodyValue = viewState.content;
    let dataUriCount = 0;
    const renameOriginalSrc = isSmimeEnabledInViewState(viewState.smimeViewState);
    if (viewState.useSmartResponse) {
        bodyValue = bodyValue + createAppendOnSendBlock(viewState.bodyType);
    }
    if (viewState.bodyType == 'HTML') {
        const textDirection = getTextDirection(viewState);
        bodyValue = removeSrcAttributeFromInlineImages(bodyValue, renameOriginalSrc);
        dataUriCount = getDataUriCount(bodyValue);
        bodyValue = format(HTML_WRAPPER, textDirection, bodyValue);
    }

    const body = bodyContentType({ BodyType: viewState.bodyType, Value: bodyValue });
    body.DataUriCount = dataUriCount;

    const itemId = createItemIdForRequest(viewState.itemId);
    const referenceItemId = createItemIdForRequest(viewState.referenceItemId);

    // Set the Message recipient headers.
    // Incase of S/MIME BCC forking the appropriate headers are set according to the value of BCC forking mode set in SmimeViewState.
    let toRecipients: EmailAddressWrapper[] = [],
        ccRecipients: EmailAddressWrapper[] = [],
        bccRecipients: EmailAddressWrapper[] = [];
    if (
        viewState.smimeViewState &&
        viewState.smimeViewState.smimeBccForkingMode != SmimeBccForkingMode.None
    ) {
        const { smimeBccForkingMode } = viewState.smimeViewState;
        switch (smimeBccForkingMode) {
            case SmimeBccForkingMode.IncludeOnlyToAndCc:
                toRecipients = getRecipientsFromWellViewState(viewState.toRecipientWell);
                ccRecipients = getRecipientsFromWellViewState(viewState.ccRecipientWell);
                break;
            case SmimeBccForkingMode.IncludeSingleBccInEachMessage:
                if (viewState.bccRecipientWell) {
                    const currentBccRecipient = viewState.smimeViewState.currentBccRecipientIndex;
                    bccRecipients = [
                        getRecipientsFromWellViewState(viewState.bccRecipientWell)[
                            currentBccRecipient
                        ],
                    ];
                }
                break;
            case SmimeBccForkingMode.IncludeAllBccInSingleMessage:
                if (viewState.bccRecipientWell) {
                    bccRecipients = getRecipientsFromWellViewState(viewState.bccRecipientWell);
                }
                break;
        }
    } else {
        toRecipients = getRecipientsFromWellViewState(viewState.toRecipientWell);
        ccRecipients = getRecipientsFromWellViewState(viewState.ccRecipientWell);
        bccRecipients = getRecipientsFromWellViewState(viewState.bccRecipientWell);
    }

    let messageType: Message;

    const commonMessageFields: Partial<Message> = {
        Subject: viewState.subject || '',
        Importance: viewState.importance,
        IsReadReceiptRequested: viewState.isReadReceiptRequested,
        IsDeliveryReceiptRequested: viewState.isDeliveryReceiptRequested,
        ToRecipients: toRecipients,
        CcRecipients: ccRecipients,
        BccRecipients: bccRecipients,
        Sensitivity: viewState.sensitivity,
    };

    let createMessageType;
    if (viewState.useSmartResponse) {
        // If the current compose form uses smart response, we always send the CreateItem request for both send and save
        // since there is not quoted body in inline compose, we could only set NewBodyContent,
        // Server side will find out the quoate body and create this item.
        createMessageType =
            viewState.operation == ComposeOperation.ReplyAll ? replyAllToItem : replyToItem;
        messageType = createMessageType({
            ...commonMessageFields,
            UpdateResponseItemId: itemId,
            ReferenceItemId: referenceItemId,
            ReferenceItemDocumentId: viewState.referenceItemDocumentId || 0,
            NewBodyContent: body,
        });
    } else if (
        viewState.operation == ComposeOperation.Approve ||
        viewState.operation == ComposeOperation.Reject
    ) {
        createMessageType =
            viewState.operation == ComposeOperation.Approve
                ? approveRequestItem
                : rejectRequestItem;
        messageType = createMessageType({
            ...commonMessageFields,
            ReferenceItemId: referenceItemId,
            ItemId: itemId,
            Body: body,
        });
    } else {
        // If the current compose form is full compose and the compose is newly opened, there is no itemId for it
        // We use CreateItem to create this new item.
        // When the response is back from the server, the itemId will be set.
        // Next time to send or save in full compose, we could use sendOrSaveMessageService to update item.
        messageType = message({
            ...commonMessageFields,
            Body: body,
        });

        if (viewState.itemId) {
            messageType.ItemId = viewState.itemId;
        }
    }

    if (viewState.fromViewState) {
        setFromInfoToMessage(viewState.fromViewState, messageType);
    }

    if (viewState.deferredSendTime) {
        setDeferredSendTimeToMessage(viewState.deferredSendTime, messageType);
    }

    return messageType;
}

function addExtendedProperty(message: Message, extendedPropertyType: ExtendedPropertyType) {
    if (message.ExtendedProperty == null) {
        message.ExtendedProperty = [extendedPropertyType];
    } else {
        //TODO: Dedupe step.
        message.ExtendedProperty.push(extendedPropertyType);
    }
}

async function sendOrSaveMessage(
    viewState: ComposeViewState,
    isSend: boolean
): Promise<ItemInfoResponseMessage> {
    let item;
    let response;

    const timeFormat = getUserConfiguration().UserOptions.TimeFormat;
    if (isPublicFolderComposeViewState(viewState)) {
        const publicFolderComposeViewState: PublicFolderComposeViewState = viewState as PublicFolderComposeViewState;
        item = getPostForRequest(viewState);
        response = await createItem(
            item,
            viewState.bodyType,
            isSend,
            timeFormat,
            viewState.isInlineCompose,
            getIRMDataBeforeSending(viewState.protectionViewState),
            publicFolderComposeViewState.publicFolderId
        );
    } else {
        item = getMessageForRequest(viewState, isSend);

        // Prepare any extra data prior to any send or save
        item.Attachments = await tryAddSmimeAttachmentsInRequest(viewState);
        tryUpdateExtendedPropertiesForInternetHeaders(viewState.addin, item as Message);
        tryUpdateExtendedPropertiesForAppendOnSend(viewState.addin, item as Message, isSend);
        tryUpdateExtendedPropertiesForComposeType(viewState.addin, item as Message, isSend);

        // CLP extended property is breaking groups api.
        // This issue doesn't exist on other platforms
        // We need to figure out what we need to do for
        // applying clp labels on group messages in OWA
        // We will ignore clp label for group scenario for now.
        const { protectionViewState } = viewState;
        if (isFeatureEnabled('cmp-clp') && !isGroupComposeViewState(viewState)) {
            const { clpViewState } = protectionViewState;
            stampCLPLabelInExtendedProperty(clpViewState, item as Message);
        }

        if (protectionViewState?.classificationViewState) {
            stampMessageClassification(
                protectionViewState.classificationViewState,
                item as Message
            );
        }

        // Add extended properties to preserve the original from address.
        if (isSendAsAliasEnabled()) {
            stampOriginalSmtpFromAddress(viewState.fromViewState, item as Message);
        }

        const loadAtMentionData =
            viewState.mentionsPicker?.atMentionTuples &&
            Object.keys(viewState.mentionsPicker.atMentionTuples).length > 0
                ? await lazyLoadAtMentionsData.import()
                : null;
        loadAtMentionData?.(viewState.mentionsPicker, isSend, item);

        // Figure out which API to use
        if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
            try {
                const addSmimePropertiesRequest = getAddSmimePropertiesRequestObject(
                    viewState,
                    item,
                    isSend
                );
                await lazyTryAddSmimeProperties
                    .import()
                    .then(tryAddSmimeProperties =>
                        tryAddSmimeProperties(addSmimePropertiesRequest)
                    );
            } catch (e) {
                const error = new Error() as CustomError;
                error.message =
                    e.message == CANCEL_SMIME_SEND_ERROR_MESSAGE
                        ? CANCEL_SMIME_SEND_ERROR_MESSAGE
                        : 'SmimeEncodeError: ' + e.message;
                return Promise.reject(error);
            }
        } else if (viewState.itemId) {
            // Reset S/MIME item class if user switches from S/MIME to non-S/MIME scenario
            const mailItem = getStore().items.get(viewState.itemId.Id);
            if (mailItem && isItemClassSmime(mailItem.ItemClass)) {
                item.ItemClass = ITEM_CLASS_NOTE;
            }
        }

        // DLP information is only set when the message is sent.
        if (isSend) {
            const dlpProperties = getDlpInformationFromViewState(viewState.policyTipsViewState);
            dlpProperties.map(property => addExtendedProperty(item, property));
        }

        response = await selectAndExecuteSendOrSaveApi(viewState, item, timeFormat, isSend);
    }
    clearKeysOfInternetHeadersToBeRemoved(viewState.addin);
    const responseMessage = response?.ResponseMessages?.Items
        ? (response.ResponseMessages.Items[0] as ItemInfoResponseMessage)
        : response && !response.ResponseMessages //this is needed for PostUnifiedGroupItem, which only returns a response instead of an array.
        ? (response as ItemInfoResponseMessage)
        : null;

    if (responseMessage && responseMessage.ResponseClass == 'Success') {
        return Promise.resolve(responseMessage);
    } else {
        preHandleErrorResponse(response, viewState);
        let error: CustomError;
        if (responseMessage) {
            error = new Error(responseMessage.ResponseCode) as CustomError;
            error.messageText = responseMessage.MessageText;
        } else {
            error = new Error('Unrecognized response') as CustomError;
        }
        return Promise.reject(error);
    }
}

function selectAndExecuteSendOrSaveApi(
    viewState: ComposeViewState,
    message: Message,
    timeFormat: string,
    isSend: boolean
): Promise<CreateItemResponse | UpdateItemResponse> {
    if (isGroupComposeViewState(viewState)) {
        if (isSend && viewState.operation != ComposeOperation.Forward) {
            if (
                isConsumer() ||
                viewState.itemId ||
                message.RightsManagementLicenseData ||
                viewState.protectionViewState?.IRMData
            ) {
                return postGroupItem(
                    viewState.groupId,
                    message,
                    viewState.bodyType,
                    timeFormat,
                    getIRMDataBeforeSending(viewState.protectionViewState),
                    viewState.isInlineCompose
                );
            }
            const groupMailboxInfo = getGroupMailboxInfo(viewState.groupId);
            return PostUnifiedGroupItem(
                viewState.groupId,
                message,
                viewState.bodyType,
                timeFormat,
                getMailboxRequestOptions(groupMailboxInfo),
                viewState.isInlineCompose
            );
        } else {
            const isReply =
                viewState.operation == ComposeOperation.Reply ||
                viewState.operation == ComposeOperation.ReplyAll;

            if ((!viewState.itemId && isReply) || viewState.useSmartResponse) {
                return createResponseFromModernGroup(
                    viewState.groupId,
                    message,
                    viewState.bodyType,
                    false /* isSend */,
                    timeFormat,
                    viewState.isInlineCompose
                );
            }
        }
    }
    const selectedNode = getSelectedNode();
    // To fix the XRF access issue, we set RemoteExecute for archive and shared folder scenarios.
    // For CreateItem, we do not set X-AnchorMailbox header, the request will always hit primary mailbox user's mailbox server.
    // On server side code, we have code fix to check the flag when reply/replyall/forward emails.
    const remoteExecute = !!(
        selectedNode &&
        (selectedNode.treeType === SHARED_FOLDERS_TREE_TYPE ||
            selectedNode.treeType === ARCHIVE_FOLDERS_TREE_TYPE)
    );

    // Set the DocLinks property for OneDrive links in the body
    if (isSend) {
        const docLinks: DocLink[] = getDocLinks(viewState.attachmentWell?.sharingLinkIds);
        if (docLinks && docLinks.length > 0) {
            message.DocLinks = docLinks;
        }
    }

    let result: Promise<CreateItemResponse | UpdateItemResponse>;
    const irmData = getIRMDataBeforeSending(viewState.protectionViewState);
    if (shouldUseApolloForService(viewState, message, irmData)) {
        if (!viewState.itemId) {
            result = createItemViaGraphQL(message, isSend, viewState);
        } else {
            result = sendOrSaveViaGraphQL(message, isSend, viewState);
        }
    }

    if (!result) {
        if (viewState.useSmartResponse || !viewState.itemId) {
            result = createItem(
                message,
                viewState.bodyType,
                isSend,
                timeFormat,
                viewState.isInlineCompose,
                irmData,
                null,
                remoteExecute
            );
        } else {
            result = sendOrSaveMessageService(
                message,
                isSend,
                irmData,
                viewState.addin.keysOfInternetHeadersToBeRemoved
            );
        }
    }

    return result;
}

export function sendMessage(viewState: ComposeViewState): Promise<ItemInfoResponseMessage> {
    return sendOrSaveMessage(viewState, true /*isSend*/);
}

export function saveMessage(viewState: ComposeViewState): Promise<ItemInfoResponseMessage> {
    return sendOrSaveMessage(viewState, false /*isSend*/);
}

export function handleSuccessResponse(
    responseMessage: ItemInfoResponseMessage,
    viewState: ComposeViewState
): boolean {
    // The existence of message is not a reliable determining factor of if the request has succeeded
    // Instead using ResponseClass to determine if request's success.
    if (checkIfResponseSuccess(responseMessage)) {
        const message = getMessageFromItemInfoResponseMessage(responseMessage);
        if (message) {
            if (!isSmimeEnabledInViewState(viewState.smimeViewState)) {
                // Check if there are any S/MIME attachments which were uploaded as part of createItem/updateItem call
                // This happens when we open a S/MIME response(r/R/f) or a S/MIME draft in non-S/MIME mode when it can't be opened in S/MIME mode.
                lazyGetAllValidAttachments.import().then(getAllValidAttachments => {
                    const smimeAttachments = getAllValidAttachments(
                        viewState.attachmentWell,
                        viewState.content,
                        viewState.bodyType,
                        true /* filterSmimeAttachment */
                    );

                    smimeAttachments.length &&
                        lazyUpdateSmimeAttachmentIds
                            .import()
                            .then(updateSmimeAttachmentIds =>
                                updateSmimeAttachmentIds(
                                    smimeAttachments,
                                    message.Attachments,
                                    itemId({ Id: viewState.composeId })
                                )
                            );
                });
            }

            if (message.ItemId) {
                updateComposeItemId(
                    viewState,
                    message.ItemId.Id,
                    message.ItemId.ChangeKey,
                    message.LastModifiedTime
                );

                if (message.Body && isGroupComposeViewState(viewState)) {
                    viewState.lastSavedMessageBody = message.Body.Value;
                }
            }
            if (message.InternetMessageId) {
                updateInternetMessageId(
                    viewState.conversationId,
                    viewState.itemId ? viewState.itemId.Id : null,
                    message.InternetMessageId
                );
            }
        }
        return true;
    }
    return false;
}

function getMessageFromItemInfoResponseMessage(responseMessage: ItemInfoResponseMessage): Message {
    // VSO 16297: responseMessage.Items is null when the request contains attachment
    // Workaround it here to check null before we use it. We can remove this check or this comment once we figure out why Items can be null
    if (responseMessage?.Items) {
        return responseMessage.Items[0] as Message;
    } else if (((responseMessage as object) as PostUnifiedGroupItemResponse)?.Item) {
        return ((responseMessage as object) as PostUnifiedGroupItemResponse).Item as Message;
    }

    return null;
}

function getTextDirection(viewState: ComposeViewState): 'ltr' | 'rtl' {
    return viewState.textDirection || (isCurrentCultureRightToLeft() ? 'rtl' : 'ltr');
}

function preHandleErrorResponse(response: any, viewState: ComposeViewState) {
    if (response) {
        setWasclUrls(response.WasclUpgradeToPremiumUrl, response.AccountRecoveryFlowUrl);

        const responseMessage = response.ResponseMessages?.Items
            ? (response.ResponseMessages.Items[0] as ItemInfoResponseMessage)
            : null;
        if (
            responseMessage &&
            (responseMessage.ResponseCode == 'ErrorExceededMessageLimit' ||
                responseMessage.ResponseCode == 'ErrorExceededHourlyMessageLimit' ||
                responseMessage.ResponseCode == 'ErrorExceededMessageLimitShowTierUpgrade')
        ) {
            trySaveMessage(viewState, true /*isAutoSave*/);
        }
    }
}

// We should use Apollo IFF
// 1) The feature is enabled.
// 2) The written resolves support the operation type
// 3) It is not an S/MIME message
// 4) The message type does not contain the Attachments property due to S/MIME forwarding scenarios, or it is empty.
// 5) There is no IRM data.
function shouldUseApolloForService(
    viewState: ComposeViewState,
    message: Message,
    irmData?: RightsManagementLicenseDataType
) {
    return (
        isFeatureEnabled('mon-cmp-experimentalGraphQLCompose') &&
        isSupportedOperation(viewState.operation) &&
        !isSmimeEnabledInViewState(viewState.smimeViewState) &&
        !(message.Attachments && message.Attachments.length > 0) &&
        !irmData
    );
}
