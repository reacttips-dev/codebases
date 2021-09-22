import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default function filterInvalidRecipients(
    originalList: EmailAddressWrapper[]
): EmailAddressWrapper[] {
    return originalList.filter(wrapper => {
        return !!wrapper.EmailAddress;
    });
}
