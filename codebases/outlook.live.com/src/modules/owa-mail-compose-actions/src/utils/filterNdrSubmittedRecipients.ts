import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

// NDR resend items have a recipients record with a Submitted field to show
// which recipients an email was successfully and unsuccessfully sent to
// Redelivery will only occur to the recipients whose Submitted=false
// Filter and return only these recipients (VSO 41578)
export default function filterNdrSubmittedRecipients(
    recipients: EmailAddressWrapper[]
): EmailAddressWrapper[] {
    return recipients.filter(recipient => {
        return !recipient.Submitted;
    });
}
