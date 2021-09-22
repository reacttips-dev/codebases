import { format } from 'owa-localize';
import focusedInboxRollupStore from '../store/store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import { MailFolderTableQuery } from 'owa-mail-list-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type FolderChangeDigestResponse from 'owa-service/lib/contract/FolderChangeDigestResponse';
import type GetFolderChangeDigestResponse from 'owa-service/lib/contract/GetFolderChangeDigestResponse';
import InboxViewType from 'owa-service/lib/contract/InboxViewType';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import folderId from 'owa-service/lib/factory/folderId';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import getFolderChangeDigest from '../services/getFolderChangeDigestService';

// Max number of unseen count to display in rollup
const MAX_UNSEEN_COUNT_TO_DISPLAY = 99;

/**
 * Action to get focused inbox rollup data
 * @param tableQuery for which to get rollup data
 */
export default action('getFolderChangeDigestAction')(function getFolderChangeDigestAction(
    tableQuery: MailFolderTableQuery
) {
    const isFocusedView = tableQuery.focusedViewFilter == FocusedViewFilter.Focused;
    const viewType = isFocusedView ? InboxViewType.FocusedView : InboxViewType.ClutterView;
    const viewState = getUserConfiguration().ViewStateConfiguration;
    const watermark = isFocusedView
        ? viewState.FocusedViewWatermark
        : viewState.ClutterViewWatermark;
    focusedInboxRollupStore.viewType = viewType;

    getFolderChangeDigest(
        targetFolderId({ BaseFolderId: folderId({ Id: tableQuery.folderId }) }),
        viewType,
        watermark,
        getListViewTypeForFolder(tableQuery.folderId) == ReactListViewType.Conversation
    ).then(response => processResponse(response));
});

// Process GetFolderChangeDigestResponse
function processResponse(response: GetFolderChangeDigestResponse) {
    if (response.Folders == null || response.Folders.length == 0) {
        // GetFolderChangeDigestResponse.Folders can be null in case of server exception while processing the request
        trace.info('GetFolderChangeDigestResponse.Folders is null or empty');
        return;
    }

    const folder: FolderChangeDigestResponse = response.Folders[0];

    // Update rollup store state with response data
    const uniqueSenders = folder.RecentUniqueSenders || [];
    focusedInboxRollupStore.uniqueSenders = uniqueSenders.join('; ').toString();
    focusedInboxRollupStore.unseenCountToDisplay = getUnseenCountToDisplay(folder.UnseenCount);
}

// Get unseen count to dsiplay in rollup
function getUnseenCountToDisplay(count: number) {
    if (count === 0) {
        return null;
    }

    if (count > MAX_UNSEEN_COUNT_TO_DISPLAY) {
        return format('{0}+', MAX_UNSEEN_COUNT_TO_DISPLAY);
    }

    return count.toString();
}
