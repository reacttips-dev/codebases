import { isShowFullEmailForEnterprise } from 'owa-mail-store';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import isSenderEmailInTrustedSendersOrDomains from 'owa-trusted-senders/lib/utils/isSenderEmailInTrustedSendersOrDomains';
import { senderYou } from './SenderDisplayName.locstring.json';
import loc from 'owa-localize';

const CONTACT_MAILBOX_TYPE = 'Contact';

export default function (
    name: string,
    emailAddress: string,
    mailboxType: string,
    hideSMTP: boolean,
    messageSafetyLevel: MessageSafetyLevel,
    displayYouForSelf: boolean,
    showSMTPoverride: boolean
): string[] {
    // Always show SMTP in print preview or
    // For consumers, if we shouldn't explicitly hide it, we have an emailAddress that's different from the sender name,
    // and we shouldn't display as contact, append the email address.
    // For enterprise users, check whether we need to show full email.
    if (
        emailAddress &&
        (showSMTPoverride ||
            (!hideSMTP &&
                (isConsumer() || isShowFullEmailForEnterprise(name, emailAddress, mailboxType)) &&
                !isSameStringIgnoreCase(emailAddress, name) &&
                !displayAsContact(emailAddress, mailboxType, messageSafetyLevel)))
    ) {
        return [name, ` <${emailAddress}>`];
    } else if (displayYouForSelf && isSelf(emailAddress)) {
        return [loc(senderYou)];
    } else {
        return [name];
    }
}

function displayAsContact(
    emailAddress: string,
    mailboxType: string,
    messageSafetyLevel: MessageSafetyLevel
): boolean {
    return (
        mailboxType == CONTACT_MAILBOX_TYPE ||
        isSelf(emailAddress) ||
        (isConsumer()
            ? // For consumers, if the sender's email or domain is contained in the list of trusted senders and domains, display like it's a contact.
              isSenderEmailInTrustedSendersOrDomains(emailAddress)
            : // For enterprise, if the message safety level is trusted or safe, display like it's a contact.
              isMessageSafetyLevelTrustedOrSafe(messageSafetyLevel))
    );
}

function isSelf(address: string): boolean {
    return isSameStringIgnoreCase(address, getUserConfiguration().SessionSettings.UserEmailAddress);
}

function isSameStringIgnoreCase(str1: string, str2: string): boolean {
    return str1 && str2 && str1.toLowerCase() == str2.toLowerCase();
}

function isMessageSafetyLevelTrustedOrSafe(messageSafetyLevel: MessageSafetyLevel) {
    return (
        messageSafetyLevel == MessageSafetyLevel.Trusted ||
        messageSafetyLevel == MessageSafetyLevel.Safe
    );
}
