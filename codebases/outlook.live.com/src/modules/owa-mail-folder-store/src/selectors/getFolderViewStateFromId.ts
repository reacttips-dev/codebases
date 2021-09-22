import setFolderViewState from '../actions/setFolderViewState';
import type MailFolderNodeViewState from '../store/schema/MailFolderNodeViewState';
import { default as folderTreeViewStateStore } from '../store/store';
import createDragViewState from 'owa-dnd/lib/utils/createDragViewState';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import { MailSortHelper, SortBy } from 'owa-mail-list-store';
import { default as getListViewTypeForFolder } from '../utils/getListViewTypeForFolder';
import type { ObservableMap } from 'mobx';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface GetFolderViewStateFromIdState {
    folderNodeViewStates: ObservableMap<string, MailFolderNodeViewState>;
}

export default function getFolderViewStateFromId(
    folderId: string
): MailFolderNodeViewState | undefined {
    const defaultSortBy: SortBy = MailSortHelper.getDefaultSortBy();
    if (!folderTreeViewStateStore.folderNodeViewStates.has(folderId)) {
        setFolderViewState(folderId, {
            isExpanded: false,
            sortColumn: defaultSortBy.sortColumn,
            sortOrder: defaultSortBy.sortDirection,
            drag: createDragViewState(),
            drop: createDropViewState(),
        });
    }

    const viewState = folderTreeViewStateStore.folderNodeViewStates.get(folderId);

    // Always use default sort for Conversation list views in Monarch unless the sort flight is on
    if (
        isHostAppFeatureEnabled('nativeResolvers') &&
        isFeatureEnabled('mon-conv-useHx') &&
        !isFeatureEnabled('mon-conv-useHxForConvListViewSort')
    ) {
        if (getListViewTypeForFolder(folderId) === ReactListViewType.Conversation) {
            return {
                ...viewState,
                sortColumn: defaultSortBy.sortColumn,
                sortOrder: defaultSortBy.sortDirection,
            };
        }
    }

    return viewState;
}
