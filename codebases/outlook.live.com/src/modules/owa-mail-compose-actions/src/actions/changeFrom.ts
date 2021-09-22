import setIsFromEditing from './setIsFromEditing';
import type { FromViewState } from 'owa-mail-compose-store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { action } from 'satcheljs/lib/legacy';

export default action('changeFrom')(function changeFrom(
    viewState: FromViewState,
    sendAsAddress: string,
    sendAsDisplayName?: string
) {
    if (viewState.from.email != sendAsAddress) {
        viewState.from = {
            email: <EmailAddressWrapper>{
                MailboxType: 'Mailbox',
                RoutingType: 'SMTP',
                EmailAddress: sendAsAddress,
                Name: sendAsDisplayName
                    ? sendAsDisplayName
                    : getUserConfiguration().SessionSettings.UserDisplayName,
            },
        };
    }

    setIsFromEditing(viewState, false /* isFromEditing */);
});
