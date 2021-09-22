import { logUsage } from 'owa-analytics';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import { lazyGetPendingInsertLinkIds, lazyGetAllInsertLinksIds } from 'owa-insert-link';
import { isInsertLinksNotSupported } from './validateFromInsertLinks';

export async function logPopoutInsertLinksDatapoints(viewState: EditorViewState) {
    if (isInsertLinksNotSupported()) {
        return;
    }

    const getAllInsertLinksIds = await lazyGetAllInsertLinksIds.import();
    const insertLinksIds: string[] = getAllInsertLinksIds(viewState);
    const getPendingInsertLinkIds = await lazyGetPendingInsertLinkIds.import();
    const pendingInsertLinkIds: string[] = getPendingInsertLinkIds(insertLinksIds);
    logUsage('PopoutCheckInsertLinks', {
        pendingInsertLinksCount: Math.min(pendingInsertLinkIds.length, 23),
    });
}
