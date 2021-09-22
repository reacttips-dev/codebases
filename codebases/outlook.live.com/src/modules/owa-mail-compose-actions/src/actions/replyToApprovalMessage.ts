import openCompose from './openCompose';
import {
    ComposeOperation,
    ComposeTarget,
    composeStore,
    ComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import { getToCcRecipientsForReply } from '../utils/createReply';
import getDefaultBodyType from '../utils/getDefaultBodyType';
import getRespondSubject from '../utils/getRespondSubject';
import { getGuid } from 'owa-guid';
import type { ClientItem } from 'owa-mail-store';
import { isDeepLink } from 'owa-url';

export interface ReplyToApprovalMessageState {
    primaryComposeId: string;
}

export default async function replyToApprovalMessage(
    referenceItem: ClientItem,
    isApprove: boolean,
    shouldSend: boolean,
    state: ReplyToApprovalMessageState = { primaryComposeId: composeStore.primaryComposeId }
) {
    const openInTab = !isDeepLink();
    // If traceId is not passed create new one so we can correlate between all replies and sent
    const composeTraceId = getGuid();
    const composeOperation = isApprove ? ComposeOperation.Approve : ComposeOperation.Reject;
    const subject = getRespondSubject(referenceItem, composeOperation);
    const [toRecipients] = await getToCcRecipientsForReply(referenceItem, false /*isReplyAll*/);
    const composeInitProps: ComposeViewStateInitProps = {
        operation: composeOperation,
        bodyType: getDefaultBodyType(),
        subject: subject,
        to: toRecipients,
        referenceItemId: referenceItem.ItemId,
        preferAsyncSend: true,
        logTraceId: composeTraceId,
        sendAfterOpen: shouldSend,
        bypassClientSideValidation: true,
    };
    const fullComposeTarget = openInTab
        ? ComposeTarget.SecondaryTab
        : ComposeTarget.PrimaryReadingPane;
    openCompose(composeInitProps, fullComposeTarget);
}
