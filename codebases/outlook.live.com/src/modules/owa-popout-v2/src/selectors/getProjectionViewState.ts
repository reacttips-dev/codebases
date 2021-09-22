import { getStore } from '../store/parentStore';
import type { ProjectionItem } from '../store/schema/PopoutParentStore';

export default function getProjectionViewState(tabViewId: string): ProjectionItem | undefined {
    return getStore().projections.filter(projection => projection.tabId == tabViewId)[0];
}
