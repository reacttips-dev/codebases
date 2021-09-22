import buildFilter from './entityRequest/buildFilter';
import buildProvenances from './entityRequest/buildProvenances';
import createAlterationsOptions from './createAlterationsOptions';
import createQuery from './createQuery';
import mapSortOrdering from './entityRequest/mapSortOrdering';
import type {
    EntityRequest,
    SearchSortOrder,
} from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import { convertDynamicRefinersToRefiners, convertItemTypesToEntityType } from 'owa-search-service';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';

/**
 * Creates value for EntityRequest property of 3S query request.
 */
export default function createEntityRequests(
    request: ExecuteSearchJsonRequest,
    skipAddToHistory: boolean,
    clientQueryAlterationReason: string,
    pageNumber: number,
    isAlterationsRecourse: boolean,
    apiVersion?: number
): EntityRequest[] {
    const sortOrder = mapSortOrdering(request.Body.SortOrder);
    const scoreSearchSortOrder = apiVersion === 2 ? getScoreSearchSortOrder(sortOrder) : null;
    const entityRequests: EntityRequest[] =
        apiVersion === 2
            ? [
                  {
                      EntityType: convertItemTypesToEntityType(request.Body.ItemTypes),
                      ContentSources: ['Exchange'],
                      Filter: buildFilter(request),
                      From: request.Body.ResultRowOffset,
                      Query: createQuery(request, skipAddToHistory, clientQueryAlterationReason),
                      RefiningQueries: convertDynamicRefinersToRefiners(
                          request.Body.SearchRefiners
                      ),
                      Size: request.Body.ResultRowCount,
                      Sort: sortOrder,
                      EnableTopResults: scoreSearchSortOrder?.length > 0,
                      TopResultsCount:
                          scoreSearchSortOrder?.length > 0
                              ? scoreSearchSortOrder[0].Count
                              : undefined,
                  },
              ]
            : [
                  {
                      EntityType: convertItemTypesToEntityType(request.Body.ItemTypes),
                      Filter: buildFilter(request),
                      From: request.Body.ResultRowOffset,
                      Provenances: buildProvenances(request),
                      Query: createQuery(request, skipAddToHistory, clientQueryAlterationReason),
                      RefiningQueries: convertDynamicRefinersToRefiners(
                          request.Body.SearchRefiners
                      ),
                      Size: request.Body.ResultRowCount,
                      Sort: sortOrder,
                      QueryAlterationOptions: createAlterationsOptions(
                          pageNumber,
                          isAlterationsRecourse,
                          apiVersion
                      ),
                      PropertySet: 'ProvenanceOptimized',
                  },
              ];

    return entityRequests;
}

function getScoreSearchSortOrder(sortOrder: SearchSortOrder[]) {
    return sortOrder.filter(item => {
        return item.Field === 'Score';
    });
}
