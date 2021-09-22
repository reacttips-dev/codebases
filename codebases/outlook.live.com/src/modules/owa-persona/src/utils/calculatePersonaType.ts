import { isFeatureEnabled } from 'owa-feature-flags';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { isEmailAddressBrand, isEmailAddressDecoratedBrand } from '../utils/isEmailAddressBrand';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import isConsumerGroupAddress from './isConsumerGroupAddress';

interface PersonaInfo {
    personaType: string;
    isBrand: boolean;
    isTier3Brand: boolean;
}

export const LivePersonaCardPersonaTypes = {
    NotResolved: 'NotResolved',
    User: 'User',
    Group: 'Group',
    External: 'External',
    DistributionList: 'DistributionList',
    PrivateDistributionList: 'PrivateDistributionList',
    Location: 'Location',
    Room: 'Room',
    Meeting: 'Meeting',
    Brand: 'Brand',
    Topic: 'Topic',
};

export function calculatePersonaType(
    isUnauthenticatedSender: boolean,
    mailBoxType?: string,
    personaType?: string,
    emailAddress?: string
): PersonaInfo {
    if (isUnauthenticatedSender) {
        return {
            personaType: LivePersonaCardPersonaTypes.User,
            isBrand: false,
            isTier3Brand: false,
        };
    }

    if (
        isFeatureEnabled('rp-brandCards') &&
        !isNullOrWhiteSpace(emailAddress) &&
        isEmailAddressBrand(emailAddress)
    ) {
        const isTier3Brand = isEmailAddressDecoratedBrand(emailAddress);
        return {
            personaType: LivePersonaCardPersonaTypes.Brand,
            isBrand: true,
            isTier3Brand: isTier3Brand,
        };
    }

    if (!isNullOrWhiteSpace(mailBoxType)) {
        return {
            personaType: getLivePersonaCardPersonaTypeFromMailBoxType(mailBoxType),
            isBrand: false,
            isTier3Brand: false,
        };
    }

    if (
        !isNullOrWhiteSpace(personaType) &&
        Object.keys(LivePersonaCardPersonaTypes).indexOf(personaType) > -1
    ) {
        return { personaType: personaType, isBrand: false, isTier3Brand: false };
    }

    if (isConsumerGroupAddress(emailAddress)) {
        return { personaType: 'Group', isBrand: false, isTier3Brand: false };
    }

    if (isConsumer()) {
        return { personaType: 'User', isBrand: false, isTier3Brand: false };
    }

    return { personaType: 'NotResolved', isBrand: false, isTier3Brand: false };
}

export function getLivePersonaCardPersonaTypeFromMailBoxType(mailBoxType?: string): string {
    switch (mailBoxType) {
        case 'PublicDL':
            return LivePersonaCardPersonaTypes.DistributionList;
        case 'PrivateDL':
            return LivePersonaCardPersonaTypes.PrivateDistributionList;
        case 'GroupMailbox':
            return LivePersonaCardPersonaTypes.Group;
        case 'Mailbox':
        case 'Contact':
            return LivePersonaCardPersonaTypes.User;
        case 'OneOff':
        case 'Unknown':
            return LivePersonaCardPersonaTypes.NotResolved;
        default:
            return LivePersonaCardPersonaTypes.User;
    }
}
