import { isStringNullOrWhiteSpace } from 'owa-localize';

import type { SubstrateSearchSuggestionsResponsePeopleSuggestion } from 'owa-search-service';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import isEmailAddressMasked from 'owa-substrate-people-suggestions/lib/utils/isEmailAddressMasked';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type PhoneNumberType from 'owa-service/lib/contract/PhoneNumberType';

const ENCODED_PEOPLE_INDEX_EMAIL_BASED_ID_PREFIX: string =
    'MkU4MDBGNDUtMEY3OS00MzM4LTg3RUUtNENFOTFBRURCODcx';

const itemIdFromString = (itemId: string | undefined) =>
    itemId ? { Id: itemId, __type: 'ItemId:#Exchange' } : undefined;

export default function convertSuggestionToPersonaType(
    suggestion: SubstrateSearchSuggestionsResponsePeopleSuggestion,
    transactionId: string,
    returnMaskedRecipients?: boolean,
    logicalId?: string
): FindRecipientPersonaType | null {
    const {
        EmailAddresses,
        DisplayName,
        Text,
        PDLItemId,
        ADObjectId,
        PersonaId,
        FeatureData,
        Id,
        ReferenceId,
        ImAddress,
        JobTitle,
        PeopleType,
        PeopleSubtype,
        GivenName,
        Surname,
        Alias,
        Phones,
        Department,
        OfficeLocation,
        AdditionalNames,
        PersonId,
    } = suggestion;

    const emailAddress = EmailAddresses ? EmailAddresses[0] : undefined;

    if (!returnMaskedRecipients && emailAddress && isEmailAddressMasked(emailAddress)) {
        return null;
    }

    const emailAddressWrapper: EmailAddressWrapper = {
        EmailAddress: emailAddress,
        Name: isStringNullOrWhiteSpace(DisplayName) ? Text : DisplayName,
        MailboxType: getMailboxType(PeopleSubtype),
        RoutingType: getRoutingType(PeopleSubtype),
        ItemId: itemIdFromString(PDLItemId),
    };
    const findRecipientPersonaType: FindRecipientPersonaType = {
        DisplayName: DisplayName,
        ADObjectId: ADObjectId,
        FeatureData,
        Id: Id,
        ImAddress,
        EmailAddress: emailAddressWrapper,
        EmailAddresses: [emailAddressWrapper],
        PersonaTypeString: getPersonaTypeString(PeopleSubtype),
        PersonaId: itemIdFromString(PersonaId),
        Title: JobTitle,
        ReferenceId,
        PeopleType,
        PeopleSubtype,
        GivenName,
        Surname,
        TransactionId: transactionId,
        LogicalId: logicalId,
        Alias,
        PhoneNumber: getPhoneNumberType(Phones),
        Department,
        Location: OfficeLocation,
        AdditionalNames,
        PersonId: getPersonId(PersonId),
    };

    return findRecipientPersonaType;
}

function getRoutingType(contactType: string) {
    if (contactType == 'PersonalDistributionList') {
        return 'MAPIPDL';
    }
    return 'SMTP';
}

function getPersonaTypeString(contactType: string) {
    switch (contactType) {
        case 'PublicDistributionList':
        case 'PersonalDistributionList':
            return 'DistributionList';
        case 'UnifiedGroup':
            return 'ModernGroup';
        case 'OrganizationUser':
        case 'PersonalContact':
        case 'ImplicitContact':
        case 'OrganizationContact':
            return 'Person';
        case 'LinkedIn':
            return 'LinkedIn';
        case 'ImplicitGroup':
            return 'ImplicitGroup';
        default:
            return 'Unknown';
    }
}

function getMailboxType(contactType: string) {
    switch (contactType) {
        case 'PublicDistributionList':
            return 'PublicDL';
        case 'PersonalDistributionList':
            return 'PrivateDL';
        case 'UnifiedGroup':
            return 'GroupMailbox';
        case 'ImplicitGroup':
            return 'RecommendedGroup';
        case 'OrganizationUser':
            return 'InternalMailbox';
        case 'LinkedIn':
            return 'LinkedIn';
        case 'PersonalContact':
        case 'OrganizationContact':
        case 'ImplicitContact':
        case 'Guest':
        case 'Unknown':
            return 'ExternalMailbox';
        default:
            return contactType;
    }
}

function getPhoneNumberType(contactType: any[] | undefined): PhoneNumberType {
    if (contactType?.length) {
        return {
            Number: contactType[0].Number,
            Type: contactType[0].Type,
        };
    }
    return {
        Number: '',
    };
}

function getPersonId(personId: string | undefined) {
    return personId && isPersonIdCompliant(personId) ? personId : undefined;
}

/**
 * Checks whether the person ID is compliant
 */
function isPersonIdCompliant(personId: string | undefined) {
    return personId?.indexOf('@') == -1 && !IsUserEmailBasedId(personId);
}

/**
 * Check whether a given id is derived from user content or not
 */
function IsUserEmailBasedId(id: string | undefined) {
    return id?.indexOf(ENCODED_PEOPLE_INDEX_EMAIL_BASED_ID_PREFIX) == 0;
}
