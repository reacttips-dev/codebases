import { isShowFullEmailForEnterprise } from 'owa-mail-store';
import { isUnicodeWhitespaceLikeStringOrUndefined } from 'owa-unicode-utils/lib/isUnicodeWhitespaceLikeStringOrUndefined';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default function convertRecipientsToViewState(
    wrappers?: EmailAddressWrapper[],
    alwaysShowFullEmail?: boolean
): ReadOnlyRecipientViewState[] | undefined {
    if (wrappers) {
        const convertedWrappers: ReadOnlyRecipientViewState[] = [];
        for (let i = 0; i < wrappers.length; i++) {
            const convertedWrapper: ReadOnlyRecipientViewState = {
                email: wrappers[i],
                showFullEmail:
                    alwaysShowFullEmail ||
                    isShowFullEmailForEnterprise(
                        wrappers[i].Name,
                        wrappers[i].EmailAddress,
                        wrappers[i].MailboxType
                    ) ||
                    isUnicodeWhitespaceLikeStringOrUndefined(wrappers[i].Name) ||
                    // Show the email address if the recipient takes some other transport type
                    // e.g. must be explicitly defined as not SMTP
                    (wrappers[i].RoutingType != undefined && wrappers[i].RoutingType !== 'SMTP'),
                isGroupOrDl:
                    wrappers[i].MailboxType == 'PublicDL' ||
                    wrappers[i].MailboxType == 'GroupMailbox',
            };
            convertedWrappers.push(convertedWrapper);
        }
        return convertedWrappers;
    } else {
        return undefined; //The expectation is that the list is undefined, not null, when it doesn't exist.
    }
}
