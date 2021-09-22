import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export enum RecipientType {
    Other = 0,
    DistributionList = 1,
    User = 2,
    ExternalUser = 3,
}

export enum ResponseType {
    Unknown = 0,
    Organizer = 1,
    Tentative = 2,
    Accept = 3,
    Decline = 4,
    NoResponseReceived = 5,
}

export interface EmailAddressDetails {
    address: string;
    name: string;
    appointmentResponse?: ResponseType;
    recipientType?: RecipientType;
}

export const createEmailAddressDetails = (
    emailAddress: EmailAddressWrapper
): EmailAddressDetails => {
    return {
        address: emailAddress.EmailAddress,
        name: emailAddress.Name,
        recipientType: getRecipientType(emailAddress.MailboxType),
    };
};

export const createEmailAddressDetailsFromAttendeeType = (
    emailAddress: AttendeeType
): EmailAddressDetails => {
    const details = createEmailAddressDetails(emailAddress.Mailbox);
    details.appointmentResponse = getResponseType(emailAddress.ResponseType);
    return details;
};

export const convertAttendeeTypeArrayToEmailAddressDetailsArray = (
    attendeeTypes: AttendeeType[]
): EmailAddressDetails[] => {
    if (!attendeeTypes) {
        return [];
    }

    return attendeeTypes.map(attendee => createEmailAddressDetailsFromAttendeeType(attendee));
};

export function getRecipientType(type: string): RecipientType {
    switch (type) {
        case 'PublicDL':
        case 'PrivateDL':
        case 'PublicFolder':
            return RecipientType.DistributionList;
        case 'Mailbox':
        case 'Contact':
            return RecipientType.User;
        case 'OneOff':
            return RecipientType.ExternalUser;
        default:
            return RecipientType.Other;
    }
}

function getResponseType(attendeeResponseType: string): ResponseType {
    switch (attendeeResponseType) {
        case 'Organizer':
            return ResponseType.Organizer;
        case 'Tentative':
            return ResponseType.Tentative;
        case 'Accept':
            return ResponseType.Accept;
        case 'Decline':
            return ResponseType.Decline;
        case 'NoResponseReceived':
            return ResponseType.NoResponseReceived;
        default:
            return ResponseType.Unknown;
    }
}
