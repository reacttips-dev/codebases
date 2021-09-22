import dynamicRefinerQueryType from 'owa-service/lib/factory/dynamicRefinerQueryType';
import type DynamicRefinerQueryType from 'owa-service/lib/contract/DynamicRefinerQueryType';

/**
 * Gets search refiners for search request. Currently, the only refiner
 * supported is "hasattachment".
 */
export default function getSearchRefiners(includeAttachments: boolean): DynamicRefinerQueryType[] {
    if (includeAttachments) {
        return [
            dynamicRefinerQueryType({
                RefinerQuery: 'ShallowRefiner::SearchScope:hasattachment:true',
            }),
        ];
    } else {
        return null;
    }
}
