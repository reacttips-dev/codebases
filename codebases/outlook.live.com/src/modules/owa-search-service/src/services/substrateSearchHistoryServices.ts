import getSubstrateSearchEndpoint from '../helpers/getSubstrateSearchEndpoint';
import { makePostRequest } from 'owa-ows-gateway';
import buildQueryParams from '../helpers/buildQueryParams';
import { getUrlWithAddedQueryParameters } from 'owa-url';

export type SubstrateSearchHistoryAction = 'Delete' | 'Export';

export function deleteSubstrateSearchHistoryService() {
    substrateSearchHistoryService('Delete');
}

export function exportSubstrateSearchHistoryService() {
    return substrateSearchHistoryService('Export');
}

const substrateSearchHistoryService = (action: SubstrateSearchHistoryAction) => {
    const params = buildQueryParams();
    return makePostRequest(
        getUrlWithAddedQueryParameters(getSubstrateSearchEndpoint('searchHistory'), params),
        {
            Action: action,
            Scenario: {
                Name: 'owa.react',
            },
        }
    );
};
