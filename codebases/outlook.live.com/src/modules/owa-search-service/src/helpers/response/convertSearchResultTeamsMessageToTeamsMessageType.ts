import type { User } from 'owa-teams-client/lib/store/schema/ServiceSchema';
import type { SearchResultTeamsMessage, TeamsMessage } from '../../index';
import type SubstrateSearchRequest from '../../data/schema/SubstrateSearchRequest';
import { convertUtcDateTimeToRequestTimeZone } from './converterHelpers';

export default function convertSearchResultTeamsMessageToTeamsMessageType(
    searchResultTeamsMessage: SearchResultTeamsMessage,
    request: SubstrateSearchRequest
): TeamsMessage {
    return {
        content: searchResultTeamsMessage.Preview,
        id: searchResultTeamsMessage.InternetMessageId,
        composeTime: convertUtcDateTimeToRequestTimeZone(
            searchResultTeamsMessage.DateTimeSent,
            request
        ),
        originalArrivalTime: convertUtcDateTimeToRequestTimeZone(
            searchResultTeamsMessage.DateTimeReceived,
            request
        ),
        containerId: searchResultTeamsMessage.ClientConversationId,
        imDisplayName: searchResultTeamsMessage.Sender.EmailAddress.Name,
        senderProfile: {
            displayName: searchResultTeamsMessage.Sender.EmailAddress.Name,
            email: searchResultTeamsMessage.Sender.EmailAddress.Address,
        } as User,
        displayTo: searchResultTeamsMessage.DisplayTo,
    };
}
