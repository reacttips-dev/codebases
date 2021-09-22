import createFindPeopleFeedbackManager from 'owa-controls-findpeople-feedback-manager/lib/actions/createFindPeopleFeedbackManager';
import createRecipientWell from 'owa-readwrite-recipient-well/lib/utils/createRecipientWell';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import shouldAlwaysShowBcc from './shouldAlwaysShowBcc';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { ComposeRecipientWellViewState } from 'owa-mail-compose-store';

export default function createRecipientWellInComposeViewState(
    to: EmailAddressWrapper[],
    cc: EmailAddressWrapper[],
    bcc: EmailAddressWrapper[],
    isInlineCompose: boolean
): ComposeRecipientWellViewState {
    const findPeopleFeedbackManager = createFindPeopleFeedbackManager();
    const toWell = createRecipientWell(findPeopleFeedbackManager, to);
    const isCcShown =
        (cc && cc.length > 0) || (isConsumer() ? shouldAlwaysShowBcc() : !isInlineCompose);
    const isBccShown = (bcc && bcc.length > 0) || shouldAlwaysShowBcc();

    return {
        toRecipientWell: toWell,
        ccRecipientWell: isCcShown ? createRecipientWell(findPeopleFeedbackManager, cc) : null,
        bccRecipientWell: isBccShown ? createRecipientWell(findPeopleFeedbackManager, bcc) : null,
    };
}
