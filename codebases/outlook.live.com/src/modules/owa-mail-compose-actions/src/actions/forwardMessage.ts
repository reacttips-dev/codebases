import openCompose from './openCompose';
import { getReferenceIdFromItemOrItemId } from '../datapoints';
import { ComposeOperation, ComposeTarget, ComposeViewStateInitProps } from 'owa-mail-compose-store';
import createItemIdForRequest from '../utils/createItemIdForRequest';
import getBodyTypeForResponse from '../utils/getBodyTypeForResponse';
import getDocumentId from '../utils/getDocumentId';
import getCLPLabelExtendedPropertyValue from 'owa-mail-protection/lib/utils/clp/getCLPLabelExtendedPropertyValue';
import getItemWithNormalizedBody from '../utils/getItemWithNormalizedBody';
import getQuotedBodyForSmimeItemReply from '../utils/getQuotedBodyForSmimeItemReply';
import getRespondSubject from '../utils/getRespondSubject';
import tryGetSmimeViewState from '../utils/tryGetSmimeViewState';
import { PerformanceDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import type { ActionSource } from 'owa-analytics-types';
import { isSmimeAttachment } from 'owa-attachment-model-store';
import type { MailboxInfo } from 'owa-client-ids';
import isEncryptionEnabled from 'owa-encryption-common/lib/utils/isEncryptionEnabled';
import isSendAsPermissionEnabled from './sendAsOnBehalfOfGroups';
import { getGroupDisplayName } from 'owa-group-utils/lib/utils/getGroupDisplayName';
import { userMailInteractionAction } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import getClassificationFromMessage from 'owa-mail-protection/lib/utils/classification/getClassificationFromMessage';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import forwardItem from 'owa-service/lib/factory/forwardItem';
import shouldRemoteExecuteForSelectedNode from '../utils/shouldRemoteExecuteForSelectedNode';
import { lazyGetAttachmentsForSmimeResponse } from 'owa-smime';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { isSxSDisplayed, lazyLogUsageWithSxSCustomData, getActiveSxSId } from 'owa-sxs-store';
import * as trace from 'owa-trace';
import type TriageContext from 'owa-mail-actions/lib/triage/TriageContext';
import getComposeTarget from '../utils/getComposeTarget';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import isClearSignedItem from 'owa-smime/lib/utils/isClearSignedItem';
import isSmimeAdapterUsable from 'owa-smime-adapter/lib/utils/isSmimeAdapterUsable';

export interface ForwardMessageOptions {
    targetWindow: Window;
}

export default wrapFunctionForDatapoint(
    {
        name: 'MailComposeForward',
        options: {},
        customData: (
            referenceItemOrId: ClientItem | string,
            mailboxInfo: MailboxInfo,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            suppressServerMarkReadOnReplyOrForward: boolean,
            options?: ForwardMessageOptions
        ) => [actionSource],
        actionSource: (
            referenceItemOrId: ClientItem | string,
            mailboxInfo: MailboxInfo,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            suppressServerMarkReadOnReplyOrForward: boolean,
            options?: ForwardMessageOptions
        ) => actionSource,
        cosmosOnlyData: (
            referenceItemOrId: ClientItem | string,
            mailboxInfo: MailboxInfo,
            actionSource: ActionSource,
            instrumentationContexts: InstrumentationContext[],
            suppressServerMarkReadOnReplyOrForward: boolean,
            options?: ForwardMessageOptions
        ) => getReferenceIdFromItemOrItemId(referenceItemOrId),
    },
    async function forwardMessage(
        referenceItemOrId: ClientItem | string,
        mailboxInfo: MailboxInfo,
        actionSource: ActionSource,
        instrumentationContexts: InstrumentationContext[],
        suppressServerMarkReadOnReplyOrForward: boolean,
        options?: ForwardMessageOptions
    ) {
        const sxsId = getActiveSxSId(options?.targetWindow || window);
        const openInSxS = isSxSDisplayed(sxsId);
        let referenceItem: ClientItem;
        if (typeof referenceItemOrId === 'string') {
            referenceItem = getMailStore().items.get(referenceItemOrId);
        } else {
            referenceItem = referenceItemOrId;
        }

        const bodyType = getBodyTypeForResponse(referenceItem);
        const composeOperation = ComposeOperation.Forward;
        const documentId = getDocumentId(referenceItem);
        const referenceItemId = createItemIdForRequest(referenceItem.ItemId);

        const item = forwardItem({
            ReferenceItemId: referenceItemId,
            ReferenceItemDocumentId: documentId,
            Subject: getRespondSubject(referenceItem, composeOperation),
            NewBodyContent: bodyContentType({
                BodyType: bodyType,
                Value: '',
            }),
        });

        const groupId =
            mailboxInfo && mailboxInfo.type == 'GroupMailbox'
                ? mailboxInfo.mailboxSmtpAddress
                : null;

        let openTarget = getComposeTarget(options?.targetWindow || window);

        const smimeViewState = await tryGetSmimeViewState(composeOperation, referenceItem);

        let existingLabelString = '';
        if (isCLPEnabled()) {
            existingLabelString = getCLPLabelExtendedPropertyValue(referenceItem);
        }

        const classification = getClassificationFromMessage(referenceItem);

        const commonComposeInitProps: ComposeViewStateInitProps = {
            operation: composeOperation,
            bodyType: bodyType,
            subject: item.Subject,
            referenceItemId: referenceItem.ItemId,
            referenceItemDocumentId: documentId,
            smimeViewState,
            existingLabelString: existingLabelString,
            classification,
            conversationId: referenceItem.ConversationId ? referenceItem.ConversationId.Id : null,
            isInlineCompose: false,
            shouldLoadItemLabel: !existingLabelString,
        };

        /**
         * Below check decides whether the forward mail will be an S/MIME mail
         * or not. This condition has to be first one in the below if..else block
         * because if S/MIME admin settings are enabled then by default every forward mail will
         * be an S/MIME mail. Also, if the message is an S/MIME mail or an attachment of an S/MIME mail, we need to
         * ensure that we treat it like a S/MIME mail and not make the server call since server has no info about this mail.
         */
        const isSmimeRelated =
            isSmimeAttachment(referenceItem.ItemId.Id) ||
            isSMIMEItem(referenceItem) ||
            isSmimeEnabledInViewState(smimeViewState);
        const canFallbackSmimeToRegular = isClearSignedItem(referenceItem);

        if (!groupId && isSmimeRelated && (isSmimeAdapterUsable() || !canFallbackSmimeToRegular)) {
            // Start datapoint for monitoring reliability of forwards in S/MIME (VSO 58600)
            const smimeDatapoint = new PerformanceDatapoint('ForwardInSMIME');

            try {
                /**
                 * Fetch Item from server in case normalized body is missing.
                 */
                if (!referenceItem.NormalizedBody) {
                    try {
                        referenceItem = await getItemWithNormalizedBody(referenceItem.ItemId.Id);
                    } catch (error) {
                        trace.errorThatWillCauseAlert(
                            `SMIME: The reference item's NormalizedBody cannot be retrieved while forwarding. ${error}`
                        );
                        smimeViewState.errorCode = SmimeErrorStateEnum.QuotedBodyIsNotComplete;
                    }
                }

                const quotedBody = await getQuotedBodyForSmimeItemReply(
                    referenceItem,
                    composeOperation,
                    bodyType === 'HTML'
                );

                const { supportedSmimeAttachments, unsupportedSmimeAttachmentNames } = (
                    await lazyGetAttachmentsForSmimeResponse.import()
                )(referenceItem.Attachments, referenceItem.ItemId, true /* isForward */);

                const composeInitProps: ComposeViewStateInitProps = {
                    ...commonComposeInitProps,
                    preferAsyncSend: false,
                    IRMData: isEncryptionEnabled()
                        ? referenceItem.RightsManagementLicenseData
                        : null,
                    attachments: supportedSmimeAttachments,
                    unsupportedSmimeAttachmentNames,
                    smimeQuotedBody: quotedBody,
                };

                if (openTarget === ComposeTarget.SxS) {
                    openCompose(composeInitProps, openTarget, sxsId);
                } else {
                    openCompose(composeInitProps, openTarget);
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

            const composeInitProps: ComposeViewStateInitProps = {
                ...commonComposeInitProps,
                preferAsyncSend: true,
                IRMData: isEncryptionEnabled() ? referenceItem.RightsManagementLicenseData : null,
                saveAndUpgrade: {
                    itemToSave: item,
                    groupId,
                    suppressServerMarkReadOnReplyOrForward,
                    remoteExecute: shouldRemoteExecuteForSelectedNode(),
                },
                from: fromData,
            };

            if (openTarget === ComposeTarget.SxS) {
                openCompose(composeInitProps, openTarget, sxsId);
            } else {
                openCompose(composeInitProps, openTarget, null /*targetWindow*/, groupId);
            }
        }

        const triageContext: TriageContext = {
            itemIds: [referenceItem?.ItemId?.Id],
            conversationIds: [referenceItem?.ConversationId?.Id],
        };

        userMailInteractionAction('Forward', instrumentationContexts, triageContext);

        if (openInSxS) {
            lazyLogUsageWithSxSCustomData.importAndExecute('ForwardInSxS', sxsId);
        }
    }
);
