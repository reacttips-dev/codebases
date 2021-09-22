import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import { action } from 'satcheljs/lib/legacy';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import sanitizeEmailAddressWrapperFromFindPeople from '../utils/sanitizeEmailAddressWrapperFromFindPeople';

const DEFAULT_MAX_RESULTS = 20;

export default action('processFindPeopleResult')(function processFindPeopleResult(
    resultList: FindRecipientPersonaType[],
    responseMessage: FindPeopleResponseMessage,
    appendResults: boolean,
    maxResults?: number
) {
    if (responseMessage.ResponseClass == 'Success' && responseMessage.ResultSet) {
        maxResults = maxResults ? maxResults : DEFAULT_MAX_RESULTS;
        maxResults = appendResults ? maxResults - resultList.length : maxResults;
        maxResults =
            responseMessage.ResultSet.length > maxResults
                ? maxResults
                : responseMessage.ResultSet.length;
        const transactionId = responseMessage.TransactionId;
        let personaTypeSet: FindRecipientPersonaType[] = [];
        for (let i = 0; i < maxResults; i++) {
            let result = responseMessage.ResultSet[i];
            if (result.EmailAddress) {
                personaTypeSet.push({
                    EmailAddress: sanitizeEmailAddressWrapperFromFindPeople(result.EmailAddress),
                    PersonaId: result.PersonaId,
                    ADObjectId: result.ADObjectId,
                    PersonaTypeString: result.PersonaTypeString,
                    DisplayName: result.DisplayName,
                    TransactionId: transactionId,
                });
            } else if (result.PersonaTypeString == 'ImplicitGroup') {
                personaTypeSet.push({
                    EmailAddress: getImplicitGroupEmailAddress(result),
                    PersonaId: result.PersonaId,
                    ADObjectId: result.ADObjectId,
                    Members: result.Members,
                    PersonaTypeString: result.PersonaTypeString,
                    DisplayName: result.DisplayName,
                    TransactionId: transactionId,
                });
            }
        }

        if (appendResults) {
            resultList.push(...personaTypeSet);
        } else {
            resultList.splice(0, resultList.length, ...personaTypeSet);
        }
    } else {
        throw new Error('Response resultSet should not be null');
    }
});

let getImplicitGroupEmailAddress = (emailAddressData: PersonaType): EmailAddressWrapper => {
    return {
        EmailAddress: emailAddressData.FeedbackId,
        OriginalDisplayName: emailAddressData.FeedbackId,
        Name: emailAddressData.DisplayName,
        MailboxType: 'GroupMailbox',
        RoutingType: 'SMTP',
    } as EmailAddressWrapper;
};
