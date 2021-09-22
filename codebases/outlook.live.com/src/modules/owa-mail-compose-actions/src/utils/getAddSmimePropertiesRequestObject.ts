import getFromAddressWrapper from './fromAddressUtils/getFromAddressWrapper';
import getRecipientsFromWellViewState from './getRecipientsFromWellViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type { AttachmentState } from 'owa-attachment-full-data';
import type Message from 'owa-service/lib/contract/Message';
import createSmimeDefaultViewState from 'owa-smime/lib/utils/createSmimeDefaultViewState';
import isSmimeMessageBccFork from 'owa-smime/lib/utils/isSmimeMessageBccFork';
import type { AddSmimePropertiesRequest } from 'owa-smime/lib/utils/tryAddSmimeProperties';

/**
 * Returns the AddSmimePropertiesRequestObject
 * @param viewState composeViewState of the current smime compose
 * @param message message object needs to sent to control
 * @param isSend true - if send, false - if save
 */
export default function getAddSmimePropertiesRequestObject(
    viewState: ComposeViewState,
    message: Message,
    isSend: boolean
): AddSmimePropertiesRequest {
    const smimeViewState = viewState.smimeViewState || createSmimeDefaultViewState();
    const { docViewAttachments, inlineAttachments } = viewState.attachmentWell;
    const shouldIncludeToAndCcRecipients = isSmimeMessageBccFork(smimeViewState);
    let attachments: AttachmentState[];

    attachments = docViewAttachments.slice(0);
    attachments.push(...inlineAttachments);

    return {
        smimeViewState,
        message,
        fromAddress: getFromAddressWrapper(),
        isSend,
        composeId: viewState.composeId,
        toRecipients: shouldIncludeToAndCcRecipients
            ? getRecipientsFromWellViewState(viewState.toRecipientWell)
            : [],
        ccRecipients: shouldIncludeToAndCcRecipients
            ? getRecipientsFromWellViewState(viewState.ccRecipientWell)
            : [],
        attachments,
    };
}
