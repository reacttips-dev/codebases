import type { Provenance } from 'owa-search-service/lib/data/schema/SubstrateSearchShared';
import type BaseSearchScopeType from 'owa-service/lib/contract/BaseSearchScopeType';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';

export default function buildProvenances(request: ExecuteSearchJsonRequest): Provenance[] {
    const provenances: Provenance[] = [];

    request.Body.SearchScope.forEach((searchScopeType: BaseSearchScopeType) => {
        if (
            searchScopeType.__type === 'PrimaryMailboxSearchScopeType:#Exchange' ||
            request.Body.ItemTypes === 'CalendarItems'
        ) {
            provenances.push('Exchange');
        } else if (
            searchScopeType.__type === 'LargeArchiveSearchScopeType:#Exchange' ||
            searchScopeType.__type === 'SingleLargeArchiveSearchScopeType:#Exchange'
        ) {
            provenances.push('ExchangeArchive');
        }
    });

    return provenances;
}
