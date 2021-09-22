import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { EmailAddressDetails } from '../apis/getInitialData/EmailAddressDetails';

const createEmailAddressWrapper = (email: string | EmailAddressDetails): EmailAddressWrapper => {
    if (typeof email === 'string') {
        return {
            Name: email,
            EmailAddress: email,
        };
    } else {
        return {
            Name: email.name,
            EmailAddress: email.address,
        };
    }
};

const convertToEmailAddressWrappers = (
    emails: (string | EmailAddressDetails)[]
): EmailAddressWrapper[] => {
    if (!emails) {
        return [];
    }

    return emails.map(createEmailAddressWrapper);
};

export default convertToEmailAddressWrappers;
