import type EndSearchSessionResponseMessage from 'owa-service/lib/contract/EndSearchSessionResponseMessage';
import endSearchSessionRequest from 'owa-service/lib/factory/endSearchSessionRequest';
import endSearchSessionOperation from 'owa-service/lib/operation/endSearchSessionOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * This function ends the current search session.
 * @param searchSessionGuid
 */
export default function executeSearchEndSearchSessionService(
    searchSessionGuid: string
): Promise<EndSearchSessionResponseMessage> {
    return endSearchSessionOperation({
        Header: getJsonRequestHeader(),
        Body: endSearchSessionRequest({
            SearchSessionId: searchSessionGuid,
        }),
    }).then(response => response.Body);
}
