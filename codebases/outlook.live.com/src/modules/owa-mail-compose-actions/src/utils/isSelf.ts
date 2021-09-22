import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function isSameStringIgnoreCase(str1: string, str2: string): boolean {
    return str1 === str2 || (str1 && str2 && str1.toLowerCase() == str2.toLowerCase());
}

export function isSelf(address: EmailAddressWrapper): boolean {
    return (
        address &&
        isSameStringIgnoreCase(
            address.EmailAddress,
            getUserConfiguration().SessionSettings.UserEmailAddress
        )
    );
}
