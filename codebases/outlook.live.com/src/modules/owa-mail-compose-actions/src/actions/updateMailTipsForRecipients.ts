import { action } from 'satcheljs';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type { RecipientWellWithFindControlViewState } from 'owa-readwrite-recipient-well/lib/orchestrators/removePersonaFromWellOrchestrator';

export default action(
    'updateMailTipsForRecipients',
    (
        composeId: string,
        recipientWell: RecipientWellWithFindControlViewState,
        recipients: ReadWriteRecipientViewState[]
    ) => ({
        composeId,
        recipientWell,
        recipients,
    })
);
