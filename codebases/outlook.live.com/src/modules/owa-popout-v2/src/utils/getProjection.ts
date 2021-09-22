import store from '../store/parentStore';
import type { ProjectionItem } from '../store/schema/PopoutParentStore';

export default function getProjection(tabIdOrWindow: string | Window): ProjectionItem {
    return store.projections?.filter(p => p.tabId == tabIdOrWindow || p.window == tabIdOrWindow)[0];
}
