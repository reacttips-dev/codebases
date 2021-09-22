import type {
    default as SubstrateSearchRequest,
    SubstrateSearchRequestV2,
} from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';
import { getTimeZone } from 'owa-search-service';
import createEntityRequests from './createEntityRequests';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import createAlterationsOptions from './createAlterationsOptions';

/**
 * Converts ExecuteSearch request to 3S query request.
 */
export default function executeSearchRequestToSubstrateRequest(params: {
    request: ExecuteSearchJsonRequest;
    cvid: string;
    skipAddToHistory: boolean;
    clientQueryAlterationReason: string;
    isAlterationsRecourse: boolean;
    pageNumber: number;
    substrateSearchScenario: SubstrateSearchScenario;
    apiVersion?: number;
}): SubstrateSearchRequest {
    const {
        request,
        cvid,
        skipAddToHistory,
        clientQueryAlterationReason,
        pageNumber,
        substrateSearchScenario,
        isAlterationsRecourse,
        apiVersion,
    } = params;

    const substrateSearchRequest: SubstrateSearchRequest = {
        Cvid: cvid,
        Scenario: { Name: substrateSearchScenario },
        TimeZone: getTimeZone(request.Header),
        TextDecorations: 'Off',
        EntityRequests: createEntityRequests(
            request,
            skipAddToHistory,
            clientQueryAlterationReason,
            pageNumber,
            isAlterationsRecourse,
            apiVersion
        ),
    };

    if (apiVersion === 2) {
        (substrateSearchRequest as SubstrateSearchRequestV2).QueryAlterationOptions = createAlterationsOptions(
            pageNumber,
            isAlterationsRecourse,
            apiVersion
        );
    }

    if (substrateSearchScenario == SubstrateSearchScenario.Mail) {
        substrateSearchRequest.LogicalId = cvid;
    }

    return substrateSearchRequest;
}
