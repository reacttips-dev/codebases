import { action } from 'satcheljs';
import type { ActionSource } from 'owa-analytics-types';

export default action(
    'MARK_ITEMS_READ_BASED_ON_NODE_IDS',
    (
        nodeIds: string[],
        tableViewId: string,
        isReadValueToSet: boolean,
        isExplicit: boolean,
        actionSource: ActionSource
    ) => ({
        nodeIds,
        tableViewId,
        isReadValueToSet,
        isExplicit,
        actionSource,
    })
);
