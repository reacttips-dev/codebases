import { action } from 'satcheljs';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default action(
    'onRemoveRecipientFromMailTip',
    (viewState: ComposeViewState, recipients: EmailAddressWrapper[]) => ({
        viewState,
        recipients,
    })
);
