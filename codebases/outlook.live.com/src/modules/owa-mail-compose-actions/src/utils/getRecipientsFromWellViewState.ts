import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

export default function getRecipientsFromWellViewState(
    wellViewState: RecipientWellWithFindControlViewState
): EmailAddressWrapper[] {
    const emails: EmailAddressWrapper[] = [];
    if (wellViewState?.recipients) {
        for (const recipient of wellViewState.recipients) {
            const emailAddress = recipient.persona.EmailAddress;
            if (emailAddress?.ItemId && emailAddress.MailboxType == 'PrivateDL') {
                // VSO 18660: make sure send to PDL correctly
                // Follow jsMVVM behavior, ChangeKey needs to be null
                emails.push({
                    Name: emailAddress.Name,
                    RoutingType: emailAddress.RoutingType,
                    MailboxType: emailAddress.MailboxType,
                    ItemId: {
                        Id: emailAddress.ItemId.Id,
                        ChangeKey: null,
                    },
                    EmailAddressIndex: emailAddress.EmailAddressIndex,
                    RelevanceScore: emailAddress.RelevanceScore || 0,
                });
            } else {
                emails.push(recipient.persona.EmailAddress);
            }
        }
    }
    return emails;
}
