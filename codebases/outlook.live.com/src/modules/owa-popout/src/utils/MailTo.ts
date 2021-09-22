/**
 * Interface to support all the parameters in a mailto link.
 * Note: subject and body are not expected to be URL encoded.
 * Sample: <a href=”mailto:youremail@example.com?&cc=secondemail@example.com&bcc=hiddenemail@example.com&subject=Subject%20Line%20Here&body=Hello%20Friend,”>Email Us!</a>
 */

export interface MailToRecipient {
    smtpAddress: string;
    displayName?: string;
}

export interface MailTo {
    to: MailToRecipient;
    cc?: MailToRecipient;
    bcc?: MailToRecipient;
    subject?: string;
    body?: string;
}

export function serializeMailTo(mailTo: MailTo): string {
    if (!mailTo.to?.smtpAddress) {
        return '';
    }

    const basicLink = 'mailto:' + serializeMailToRecipient(null, mailTo.to);

    let otherParameters = '';
    otherParameters += serializeMailToRecipient('cc', mailTo.cc);
    otherParameters += serializeMailToRecipient('bcc', mailTo.bcc);
    otherParameters += serializeStringParameter('subject', mailTo.subject);
    otherParameters += serializeStringParameter('body', mailTo.body);

    return otherParameters ? basicLink + '?' + otherParameters.slice(1) : basicLink;
}

function serializeMailToRecipient(key?: string, recipient?: MailToRecipient): string {
    if (!recipient) {
        return '';
    } else {
        const serializedRecipient = recipient.displayName
            ? recipient.displayName + '<' + recipient.smtpAddress + '>'
            : recipient.smtpAddress;
        return key ? '&' + key + '=' + serializedRecipient : serializedRecipient;
    }
}

function serializeStringParameter(key: string, value?: string): string {
    return value ? '&' + key + '=' + value : '';
}
