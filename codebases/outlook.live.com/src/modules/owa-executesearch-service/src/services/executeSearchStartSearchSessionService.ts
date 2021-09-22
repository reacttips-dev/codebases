import type { SearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import { getSearchScopeType } from 'owa-search-service/lib/helpers/searchScope/SearchScenario';
import type StartSearchSessionResponseMessage from 'owa-service/lib/contract/StartSearchSessionResponseMessage';
import SuggestionKind from 'owa-service/lib/contract/SuggestionKind';
import WarmupOptions from 'owa-service/lib/contract/WarmupOptions';
import startSearchSessionRequest from 'owa-service/lib/factory/startSearchSessionRequest';
import startSearchSessionOperation from 'owa-service/lib/operation/startSearchSessionOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * This function starts the search session. It's required for the search backend
 * to start indexing and also for instrumentation purposes.
 * @param sessionGuid Search session guid.
 */
export default function executeSearchStartSearchSessionService(
    sessionGuid: string,
    staticSearchScope: SearchScope
): Promise<StartSearchSessionResponseMessage> {
    return startSearchSessionOperation({
        Header: getJsonRequestHeader(),
        Body: startSearchSessionRequest({
            SearchSessionId: sessionGuid,
            WarmupOptions: WarmupOptions.All,
            SuggestionTypes: SuggestionKind.Keywords,
            SearchScope: getSearchScopeType(staticSearchScope),
            IdFormat: 'EwsId',
            ApplicationId: 'Owa',
        }),
    }).then(response => {
        return response.Body;
    });
}
