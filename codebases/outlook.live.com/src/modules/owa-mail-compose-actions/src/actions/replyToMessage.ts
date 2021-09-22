import openCompose from './openCompose';
import datapoints from '../datapoints';
import {
    ComposeViewState,
    ComposeOperation,
    ComposeTarget,
    ComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import createComposeViewState from '../utils/createComposeViewState';
import { createReplyItem } from '../utils/createReply';
import findInlineComposeViewState from '../utils/findInlineComposeViewState';
import getCLPLabelExtendedPropertyValue from 'owa-mail-protection/lib/utils/clp/getCLPLabelExtendedPropertyValue';
import getClassificationFromMessage from 'owa-mail-protection/lib/utils/classification/getClassificationFromMessage';
import getItemWithNormalizedBody from '../utils/getItemWithNormalizedBody';
import createRecipientWellInComposeViewState from '../utils/createRecipientWellInComposeViewState';
import getQuotedBodyForSmimeItemReply from '../utils/getQuotedBodyForSmimeItemReply';
import parseGroupProxyAddress from '../utils/parseGroupProxyAddress';
import { logReplyInfo } from '../utils/logReplyInfo';
import tryGetSmimeViewState from '../utils/tryGetSmimeViewState';
import getComposeTarget from '../utils/getComposeTarget';
import { lazyShouldAddinsForceOnSendCompliantBehavior } from 'owa-addins-core';
import { PerformanceDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import type { ActionSource } from 'owa-analytics-types';
import type { AttachmentFileAttributes } from 'owa-attachment-file-types';
import { isSmimeAttachment } from 'owa-attachment-model-store';
import type { MailboxInfo } from 'owa-client-ids';
import { getGuid } from 'owa-guid';
import { userMailInteractionAction } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import { ClientItem, getStore } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type Message from 'owa-service/lib/contract/Message';
import { lazyGetAttachmentsForSmimeResponse } from 'owa-smime';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { isSxSDisplayed, lazyLogUsageWithSxSCustomData, getActiveSxSId } from 'owa-sxs-store';
import * as trace from 'owa-trace';
import type { SmartDocOption } from 'owa-mail-smart-pill-features-types/lib/schema/SmartDocOption';
import shouldRemoteExecuteForSelectedNode from '../utils/shouldRemoteExecuteForSelectedNode';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getGroupDetails from 'owa-groups-shared-store/lib/selectors/getGroupDetails';
import { getQueryStringParameter } from 'owa-querystring';
import type TriageContext from 'owa-mail-actions/lib/triage/TriageContext';
import isSendAsAliasEnabled from 'owa-proxy-address-option/lib/utils/isSendAsAliasEnabled';
import getTabIdFromProjection from 'owa-popout-v2/lib/utils/getTabIdFromProjection';
import isSendAsPermissionEnabled from './sendAsOnBehalfOfGroups';
import { getGroupDisplayName } from 'owa-group-utils/lib/utils/getGroupDisplayName';
import { mutatorAction } from 'satcheljs';
import type ReplyAllToItem from 'owa-service/lib/contract/ReplyAllToItem';
import type ReplyToItem from 'owa-service/lib/contract/ReplyToItem';

export interface ReplyToMessageCommonOptions {
    isReplyAll: boolean;
    useFullCompose: boolean;
    actionSource?: ActionSource;
    fullComposeTarget?: ComposeTarget;
    attachmentFiles?: AttachmentFileAttributes[];
    conversationId?: string;
    instrumentationContexts: InstrumentationContext[];
    initialComposeLogTraceId?: string;
    body?: string;
    groupId?: string;
    suppressServerMarkReadOnReplyOrForward?: boolean;
    useCortanaSchedulingAssistant?: boolean;
    smartDocOption?: SmartDocOption;
    targetWindow?: Window;
}

export interface ReplyToMessageAndCreateViewStateOptions extends ReplyToMessageCommonOptions {
    referenceItemOrId: string | Message;
}

export interface ReplyToMessageActionOptions extends ReplyToMessageCommonOptions {
    referenceItemOrId: string | Message;
    onComposeViewStateCreated?: (newComposeViewState: ComposeViewState) => void;
}

// Remove groupId from ReplyToMessageCommonOptions and add replyToMessage-specific properties
export type ReplyToMessageOptions = Pick<
    ReplyToMessageCommonOptions,
    Exclude<keyof ReplyToMessageCommonOptions, 'groupId'>
> & {
    mailboxInfo: MailboxInfo;
    referenceItemOrId: string | ClientItem;
    onComposeViewStateCreated?: (newComposeViewState: ComposeViewState) => void;
};

export async function replyToMessageAndCreateViewState(
    options: ReplyToMessageAndCreateViewStateOptions
): Promise<ComposeViewState> {
    let viewState: ComposeViewState = null;
    let fullComposeTarget = options.fullComposeTarget;
    const {
        referenceItemOrId,
        isReplyAll,
        useFullCompose,
        conversationId,
        initialComposeLogTraceId,
        groupId,
        body,
        instrumentationContexts,
        attachmentFiles,
        actionSource,
        suppressServerMarkReadOnReplyOrForward,
        useCortanaSchedulingAssistant,
        smartDocOption,
        targetWindow,
    } = options;

    const sxsId = getActiveSxSId(targetWindow);
    if (fullComposeTarget === undefined) {
        fullComposeTarget = getComposeTarget(targetWindow);
    }

    let referenceItem: Message;

    if (typeof referenceItemOrId === 'string') {
        const mailStore = getStore();
        const items = mailStore?.items;

        if (items && items.has(referenceItemOrId)) {
            referenceItem = items.get(referenceItemOrId) as Message;
        }
    } else {
        referenceItem = referenceItemOrId as Message;
    }

    let existingViewState: ComposeViewState;

    if (!useFullCompose) {
        // Figure out if we are in Conversation View or Item View before finding the inline compose view.
        const id = conversationId
            ? conversationId
            : referenceItem
            ? referenceItem.ItemId?.Id
            : null;
        if (id) {
            const listViewType = conversationId
                ? ReactListViewType.Conversation
                : ReactListViewType.Message;

            existingViewState = findInlineComposeViewState(
                id,
                listViewType,
                false /*includeDelaySend*/,
                getTabIdFromProjection(targetWindow)
            );
            if (existingViewState) {
                const referenceItemId = referenceItem?.ItemId?.Id;
                const existingReferenceItemId = existingViewState?.referenceItemId?.Id;
                if (
                    referenceItemId &&
                    existingReferenceItemId &&
                    referenceItemId == existingReferenceItemId
                ) {
                    const composeOperation = isReplyAll
                        ? ComposeOperation.ReplyAll
                        : ComposeOperation.Reply;
                    if (composeOperation != existingViewState.operation) {
                        const replyItem = await createReplyItem(referenceItem, isReplyAll);

                        setComposeViewStateWells(existingViewState, replyItem, composeOperation);
                    }
                    return Promise.resolve(existingViewState);
                }
            }
        }
    }

    // If traceId is not passed create new one so we can correlate between all replies and sent
    const composeTraceId = initialComposeLogTraceId || getGuid();

    if (referenceItem) {
        // create a reply item so we can initialize composeInitProps from it
        // before creating the reply.
        const replyItem = await createReplyItem(referenceItem, isReplyAll);
        const composeOperation = isReplyAll ? ComposeOperation.ReplyAll : ComposeOperation.Reply;
        const smimeViewState = await tryGetSmimeViewState(
            composeOperation /* isReplyOrReplyAll */,
            referenceItem as ClientItem
        );

        if (isSendAsAliasEnabled()) {
            const fromAddress = getFromAddress(groupId);
            replyItem.From = fromAddress ? fromAddress : replyItem.From;
        }

        let existingLabelString = '';
        if (isCLPEnabled()) {
            existingLabelString = getCLPLabelExtendedPropertyValue(referenceItem);
        }

        const classification = getClassificationFromMessage(referenceItem);

        if (useCortanaSchedulingAssistant) {
            replyItem.CcRecipients.push({
                Name: 'Cortana',
                EmailAddress: 'cortana@calendar.help',
            });
        }

        const commonComposeInitProps: ComposeViewStateInitProps = {
            operation: composeOperation,
            bodyType: replyItem.NewBodyContent.BodyType,
            subject: replyItem.Subject,
            newContent: body,
            from: replyItem.From?.Mailbox,
            to: replyItem.ToRecipients,
            cc: replyItem.CcRecipients,
            bcc: replyItem.BccRecipients,
            referenceItemId: referenceItem.ItemId,
            attachmentFilesToUpload: attachmentFiles,
            classification,
            shouldLoadItemLabel: !existingLabelString,
        };

        /**
         * Below check decides whether the replying mail will be an S/MIME mail
         * or not. This condition has to be first one in the below if..elseIf blocks
         * because if S/MIME admin settings are enabled then by default every reply mail will
         * be an S/MIME mail. Also, if the message is an S/MIME mail or an attachment of an S/MIME mail, we need to
         * ensure that we treat it like a S/MIME mail and not make the server call since server has no info about this mail.
         */
        if (
            !groupId &&
            (isSmimeAttachment(referenceItem.ItemId?.Id) ||
                isSMIMEItem(referenceItem) ||
                isSmimeEnabledInViewState(smimeViewState))
        ) {
            // Start datapoint for monitoring reliability of replies in S/MIME (VSO 58600)
            const smimeDatapoint = new PerformanceDatapoint(
                isReplyAll ? 'ReplyAllInSMIME' : 'ReplyInSMIME'
            );

            try {
                if (!referenceItem.NormalizedBody) {
                    try {
                        referenceItem = await getItemWithNormalizedBody(referenceItem.ItemId?.Id);
                    } catch (error) {
                        trace.errorThatWillCauseAlert(
                            `SMIME: The reference item's NormalizedBody cannot be retrieved while replying. ${error}`
                        );
                        smimeViewState.errorCode = SmimeErrorStateEnum.QuotedBodyIsNotComplete;
                    }
                }

                /**
                 * Fetch Item from server in case normalized body is missing.
                 */
                const quotedBody = await getQuotedBodyForSmimeItemReply(
                    referenceItem,
                    composeOperation,
                    replyItem.NewBodyContent.BodyType === 'HTML'
                );

                const { supportedSmimeAttachments, unsupportedSmimeAttachmentNames } = (
                    await lazyGetAttachmentsForSmimeResponse.import()
                )(referenceItem.Attachments, referenceItem.ItemId, false /* isForward */);

                const composeInitProps: ComposeViewStateInitProps = {
                    ...commonComposeInitProps,
                    referenceItemDocumentId: replyItem.ReferenceItemDocumentId,
                    isInlineCompose: false /** Smime reply is not supported in inline compose */,
                    preferAsyncSend: false,
                    conversationId: conversationId,
                    logTraceId: composeTraceId,
                    IRMData: referenceItem.RightsManagementLicenseData,
                    attachments: supportedSmimeAttachments,
                    smimeViewState,
                    unsupportedSmimeAttachmentNames,
                    smimeQuotedBody: quotedBody,
                };

                viewState = createComposeViewState(composeInitProps);

                if (fullComposeTarget === ComposeTarget.SxS) {
                    openCompose(viewState, fullComposeTarget, sxsId);
                } else {
                    openCompose(viewState, fullComposeTarget);
                }

                smimeDatapoint.end();
            } catch (error) {
                smimeDatapoint.endWithError(error);
                throw error;
            }
        } else {
            const fromData = isSendAsPermissionEnabled(groupId)
                ? {
                      EmailAddress: groupId,
                      Name: getGroupDisplayName(groupId),
                      RoutingType: 'SMTP',
                      MailboxType: 'GroupMailbox',
                  }
                : null;

            const isInlineCompose = !!conversationId && !useFullCompose;
            const composeInitProps: ComposeViewStateInitProps = {
                ...commonComposeInitProps,
                referenceItemDocumentId: replyItem.ReferenceItemDocumentId,
                conversationId: conversationId || referenceItem.ConversationId?.Id,
                isInlineCompose,
                preferAsyncSend: true,
                IRMData: referenceItem.RightsManagementLicenseData,
                logTraceId: composeTraceId,
                smimeViewState,
                existingLabelString: existingLabelString,
                smartDocOption: smartDocOption,
                saveAndUpgrade: (!groupId || !isInlineCompose) && {
                    itemToSave: replyItem,
                    groupId,
                    suppressServerMarkReadOnReplyOrForward,
                    remoteExecute: shouldRemoteExecuteForSelectedNode(),
                },
                existingInlineComposeId: existingViewState?.composeId,
                from: fromData,
            };

            viewState = createComposeViewState(composeInitProps, groupId);
            const openTarget = isInlineCompose ? ComposeTarget.SecondaryTab : fullComposeTarget;
            if (openTarget === ComposeTarget.SxS) {
                openCompose(viewState, openTarget, sxsId);
            } else {
                openCompose(viewState, openTarget, targetWindow);
            }
        }

        logReplyInfo(replyItem, composeTraceId, actionSource, referenceItem.DateTimeReceived);

        let triageContext: TriageContext = {
            itemIds: [referenceItem?.ItemId?.Id],
            conversationIds: [conversationId || referenceItem?.ConversationId?.Id],
        };
        if (replyItem.ToRecipients.length == 1) {
            const recipient = replyItem.ToRecipients[0];
            const displayName = recipient.Name;
            triageContext.uniqueSenders = [displayName];
            triageContext.lastSenderMailbox = recipient;
        }
        isReplyAll
            ? userMailInteractionAction('ReplyAll', instrumentationContexts, triageContext)
            : userMailInteractionAction('Reply', instrumentationContexts, triageContext);
    }

    return viewState;
}

const setComposeViewStateWells = mutatorAction(
    'setComposeViewStateWells',
    (
        existingViewState: ComposeViewState,
        replyItem: ReplyToItem | ReplyAllToItem,
        composeOperation: ComposeOperation
    ) => {
        const {
            toRecipientWell,
            ccRecipientWell,
            bccRecipientWell,
        } = createRecipientWellInComposeViewState(
            replyItem.ToRecipients,
            replyItem.CcRecipients,
            replyItem.BccRecipients,
            true /* isInlineCompose */
        );
        existingViewState.toRecipientWell = toRecipientWell;
        existingViewState.ccRecipientWell = ccRecipientWell;
        existingViewState.bccRecipientWell = bccRecipientWell;
        existingViewState.operation = composeOperation;
    }
);

// We need to have two entrance for reply and replyAll since they are using different datapoint name
const replyToMessageAction = wrapFunctionForDatapoint(
    datapoints.MailComposeReply,
    async function replyToMessageAction(options: ReplyToMessageActionOptions) {
        const composeViewState: ComposeViewState = await replyToMessageAndCreateViewState({
            ...(options as ReplyToMessageCommonOptions),
            referenceItemOrId: options.referenceItemOrId,
            isReplyAll: false,
        });

        if (options.onComposeViewStateCreated) {
            options.onComposeViewStateCreated(composeViewState);
        }

        const sxsId = getActiveSxSId(options.targetWindow);
        if (isSxSDisplayed(sxsId)) {
            lazyLogUsageWithSxSCustomData.importAndExecute('ReplyInSxS', sxsId);
        }
    }
);

const replyAllToMessageAction = wrapFunctionForDatapoint(
    datapoints.MailComposeReplyAll,
    async function replyAllToMessageAction(options: ReplyToMessageActionOptions) {
        const composeViewState: ComposeViewState = await replyToMessageAndCreateViewState({
            ...(options as ReplyToMessageCommonOptions),
            referenceItemOrId: options.referenceItemOrId,
            isReplyAll: true,
        });

        if (options.onComposeViewStateCreated) {
            options.onComposeViewStateCreated(composeViewState);
        }

        const sxsId = getActiveSxSId(options.targetWindow);
        if (isSxSDisplayed(sxsId)) {
            lazyLogUsageWithSxSCustomData.importAndExecute('ReplyAllInSxS', sxsId);
        }
    }
);

export default async function replyToMessage(options: ReplyToMessageOptions): Promise<void> {
    const mailboxInfo = options.mailboxInfo;
    const groupId =
        mailboxInfo && mailboxInfo.type == 'GroupMailbox' ? mailboxInfo.mailboxSmtpAddress : null;

    const shouldAddinsForceFullCompose = await lazyShouldAddinsForceOnSendCompliantBehavior.import();
    if (
        (options.fullComposeTarget === ComposeTarget.PrimaryReadingPane ||
            options.fullComposeTarget === undefined) &&
        shouldAddinsForceFullCompose()
    ) {
        options.useFullCompose = true;
        options.fullComposeTarget = ComposeTarget.SecondaryTab;
    }

    const parameters = {
        ...(options as ReplyToMessageCommonOptions),
        referenceItemOrId: options.referenceItemOrId,
        groupId: groupId,
    };

    if (options.isReplyAll) {
        return replyAllToMessageAction(parameters);
    } else {
        return replyToMessageAction(parameters);
    }
}

function getFromAddress(groupId: string): SingleRecipientType {
    const useProxyEmail = getQueryStringParameter('useProxyEmail');
    const groupDetails = groupId ? getGroupDetails(groupId) : null;
    const proxyAddressList = groupDetails
        ? groupDetails.ProxyAddresses
        : getUserConfiguration().SessionSettings?.UserProxyAddresses;
    const sendAsEnabled = groupDetails ? groupDetails.AdditionalProperties?.SendAsPermission : true;

    if (!proxyAddressList || !useProxyEmail || !sendAsEnabled) {
        return null;
    }

    for (let i = 0; i < proxyAddressList.length; i++) {
        const proxyAddress = groupId
            ? parseGroupProxyAddress(proxyAddressList[i])
            : proxyAddressList[i];
        if (useProxyEmail.toLowerCase() === proxyAddress.toLowerCase()) {
            return {
                Mailbox: {
                    EmailAddress: useProxyEmail,
                },
            };
        }
    }
    return null;
}
