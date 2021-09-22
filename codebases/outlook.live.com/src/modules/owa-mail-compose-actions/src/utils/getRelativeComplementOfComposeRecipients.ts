import type Message from 'owa-service/lib/contract/Message';
import type { RecipientsCollection } from '../schema/RecipientsCollection';

export default function getRelativeComplementOfComposeRecipients(
    recipients: RecipientsCollection,
    message: Message
): string[] {
    const messageRecipients: string[] = getUniqueNamesFromMessage(message);
    const composeRecipients: string[] = getUniqueNamesFromComposeRecipients(recipients);

    return relativeComplementOfArrays(composeRecipients, messageRecipients);
}

function getUniqueNamesFromComposeRecipients(recipients: RecipientsCollection): string[] {
    const emailAddresses: string[] = [];

    recipients.toRecipients.forEach(recipient =>
        updateRecipientsList(emailAddresses, recipient.persona.EmailAddress.Name)
    );
    recipients.ccRecipients.forEach(recipient =>
        updateRecipientsList(emailAddresses, recipient.persona.EmailAddress.Name)
    );

    recipients.bccRecipients.forEach(recipient =>
        updateRecipientsList(emailAddresses, recipient.persona.EmailAddress.Name)
    );

    return emailAddresses;
}

function getUniqueNamesFromMessage(message: Message): string[] {
    const emailAddresses: string[] = [];

    if (message.ToRecipients) {
        message.ToRecipients.forEach(recipient =>
            updateRecipientsList(emailAddresses, recipient.Name)
        );
    }

    if (message.CcRecipients) {
        message.CcRecipients.forEach(recipient =>
            updateRecipientsList(emailAddresses, recipient.Name)
        );
    }

    if (message.BccRecipients) {
        message.BccRecipients.forEach(recipient =>
            updateRecipientsList(emailAddresses, recipient.Name)
        );
    }

    if (message.From) {
        updateRecipientsList(emailAddresses, message.From.Mailbox.Name);
    }

    return emailAddresses;
}

function updateRecipientsList(emailAddresses: string[], emailAddress: string) {
    if (!emailAddresses.includes(emailAddress)) {
        emailAddresses.push(emailAddress);
    }
}

function relativeComplementOfArrays<T>(arr1: T[], arr2: T[]): T[] {
    let result = arr1.filter(item => arr2.indexOf(item) === -1);

    // Removes the duplicates
    result = result.filter((item, index, arr) => arr.indexOf(item) === index);

    return result;
}
