import {
    convertSearchQueryId,
    createEmptySearchResult,
    convertSearchResultConversationToConversationType,
    convertSearchResultEventToCalendarItemType,
    convertSearchResultMessageToMessageType,
    getSearchResultSet,
} from 'owa-search-service';
import type SubstrateSearchRequest from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type { ConversationType } from 'owa-graph-schema';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';
import type Message from 'owa-service/lib/contract/Message';
import type {
    default as SubstrateSearchResponse,
    SearchResultConversation,
    SearchResultEvent,
    SearchResultMessage,
} from 'owa-search-service/lib/data/schema/SubstrateSearchResponse';

/**
 * This function converts the 3S response body to the ExecuteSearch response format.
 */
export default function substrateResponseBodyToExecuteSearchResponseBody(
    responseBody: SubstrateSearchResponse,
    request: SubstrateSearchRequest,
    substrateApiVersion: number
): ExecuteSearchResponseMessage {
    const resultSet = getSearchResultSet(responseBody);

    /**
     * If result set didn't get returned or if result set is empty return an
     * empty search result set.
     */
    if (!resultSet || !resultSet.Results || resultSet.Results.length === 0) {
        return createEmptySearchResult();
    }

    const searchResults = resultSet.Results;
    const searchResultsCount = searchResults.length;
    const entitySetType =
        substrateApiVersion === 2
            ? responseBody.EntitySets[0].EntityType
            : responseBody.EntitySets[0].Type;
    const messageList: Message[] = [];
    const conversationList: ConversationType[] = [];
    const calendarItemList: CalendarItem[] = [];

    switch (entitySetType) {
        case 'Message':
        case 'Messages':
            for (const searchResult of searchResults) {
                const messageType = convertSearchResultMessageToMessageType(
                    searchResult.Source as SearchResultMessage,
                    request
                );
                messageType.InstanceKey = searchResult.ReferenceId;
                messageList.push(messageType);
            }
            break;
        case 'Conversation':
        case 'Conversations':
            for (const searchResult of searchResults) {
                const conversationType = convertSearchResultConversationToConversationType(
                    searchResult.Source as SearchResultConversation,
                    request
                );
                conversationType.InstanceKey = searchResult.ReferenceId;
                conversationList.push(conversationType);
            }
            break;
        case 'Event':
        case 'Events':
            for (const searchResult of searchResults) {
                const eventType = convertSearchResultEventToCalendarItemType(
                    searchResult.Source as SearchResultEvent
                );
                eventType.InstanceKey = searchResult.ReferenceId;
                calendarItemList.push(eventType);
            }
            break;
        default:
            break;
    }

    return {
        SearchResults: {
            Items: messageList.length > 0 ? messageList : null,
            Conversations: conversationList.length > 0 ? conversationList : null,
            CalendarItems: calendarItemList.length > 0 ? calendarItemList : null,
            MoreResultsAvailable: resultSet.MoreResultsAvailable,
            SearchRefiners: null,
            TotalResultsCount: resultSet.Total,
            SearchTerms: responseBody.SearchTerms,
            SearchResultsCount: searchResultsCount,
            TDQueryId: convertSearchQueryId(resultSet),
        },
    };
}
