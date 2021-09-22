import type { EntityRequestRefiner } from '../../data/schema/SubstrateSearchRequest';
import type DynamicRefinerQueryType from 'owa-service/lib/contract/DynamicRefinerQueryType';

export default function convertDynamicRefinersToRefiners(
    dynamicRefiners: DynamicRefinerQueryType[]
): EntityRequestRefiner[] {
    const refinersCount = dynamicRefiners ? dynamicRefiners.length : 0;

    if (refinersCount === 0) {
        return null;
    }

    return dynamicRefiners.map((dynamicRefiner: DynamicRefinerQueryType) => {
        return {
            RefinerString: dynamicRefiner.RefinerQuery,
        };
    });
}
