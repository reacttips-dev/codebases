import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { isValidSmtpAddress } from './isValidRecipientAddress';
import getDisplayNameAndAddressFromRecipientString from './getDisplayNameAndAddressFromRecipientString';
import parseOneOffEmailAddressFromString from './parseOneOffEmailAddressFromString';

const RECIPIENT_SPLIT_REGEX = /[,;]/;

export default function processRecipientsFromUrlParameter(
    rawRecipients: string,
    recipients: EmailAddressWrapper[]
) {
    if (rawRecipients.length > 0) {
        const splitRecipients = rawRecipients.split(RECIPIENT_SPLIT_REGEX);
        splitRecipients.forEach(recipient => {
            // The mailto link spec is for mailto:<smtp>. Opt to explicitly check
            // mailto instead of isValidEmailAddress, since isValidEmailAddress also supports exchange-specific
            // recipients with custom routing protocols.
            if (isValidSmtpAddress(recipient)) {
                recipients.push({ EmailAddress: recipient, Name: recipient });
            } else {
                // Check if the recipient text includes a display name along with the SMTP address
                // NOTE: This is not strictly standard, but it's a well-known practice and it helps our own scenarios
                const addressAndName = getDisplayNameAndAddressFromRecipientString(recipient);
                const parsedEmail = parseOneOffEmailAddressFromString(
                    addressAndName.address,
                    addressAndName.displayName
                );

                // Failed to parse a recipient. do not add anyone.
                if (!parsedEmail) {
                    return;
                }

                recipients.push(parsedEmail);
            }
        });
    }
}
