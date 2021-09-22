import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type FindCategoryDetailsJsonResponse from 'owa-service/lib/contract/FindCategoryDetailsJsonResponse';
import type FindCategoryDetailsJsonRequest from 'owa-service/lib/contract/FindCategoryDetailsJsonRequest';
import findCategoryDetailsOperation from 'owa-service/lib/operation/findCategoryDetailsOperation';
import findCategoryDetailsRequest from 'owa-service/lib/factory/findCategoryDetailsRequest';
import type FindCategoryDetailsRequest from 'owa-service/lib/contract/FindCategoryDetailsRequest';

/**
 * Issues a service call to fetch contents of AllCategorizedItems search folder
 * @returns a promise with FindCategoryDetailsJsonResponse
 */
export default function findCategoryDetailsService(): Promise<FindCategoryDetailsJsonResponse> {
    const requestBody = findCategoryDetailsRequest(<FindCategoryDetailsRequest>{});

    return findCategoryDetailsOperation(<FindCategoryDetailsJsonRequest>{
        Header: getJsonRequestHeader(),
        Body: requestBody,
    });
}
