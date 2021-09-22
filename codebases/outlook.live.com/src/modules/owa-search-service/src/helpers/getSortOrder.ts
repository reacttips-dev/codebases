import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';
import { ListViewBitFlagsMasks, getIsBitSet } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';

export default function getSortOrder(
    sortOrder: ExecuteSearchSortOrder,
    maxHybridCountHint: number
): ExecuteSearchSortOrder {
    if (getIsBitSet(ListViewBitFlagsMasks.HideSearchTopResults)) {
        return 'DateTime';
    }

    if (sortOrder) {
        return sortOrder;
    }

    if (maxHybridCountHint > 0) {
        return 'Hybrid';
    }

    return 'DateTime';
}
