import type FolderChangeDigestRequest from 'owa-service/lib/contract/FolderChangeDigestRequest';
import type GetFolderChangeDigestRequest from 'owa-service/lib/contract/GetFolderChangeDigestRequest';
import type GetFolderChangeDigestResponse from 'owa-service/lib/contract/GetFolderChangeDigestResponse';
import type InboxViewType from 'owa-service/lib/contract/InboxViewType';
import type TargetFolderId from 'owa-service/lib/contract/TargetFolderId';
import getFolderChangeDigestOperation from 'owa-service/lib/operation/getFolderChangeDigestOperation';

// Max number of senders to return
const MAX_SENDERS_COUNT = 10;

/**
 * Action to get focused inbox rollup data
 * @param folderId the target folder id
 * @param InboxViewType target view type
 * @param watermark indicates last visited timestamp for the view
 * @param isConversationView whether the folder is in conversation view
 * @return the GetFolderChangeDigestResponse
 */
export default function getFolderChangeDigestService(
    folderId: TargetFolderId,
    viewType: InboxViewType,
    watermark: string,
    isConversationView: boolean
): Promise<GetFolderChangeDigestResponse> {
    const folderChangeDigest: FolderChangeDigestRequest = {
        FolderId: folderId,
        IsConversationView: isConversationView,
        ViewType: viewType,
        Watermark: watermark,
    };

    const getFolderChangeDigestRequest: GetFolderChangeDigestRequest = {
        Folders: [folderChangeDigest],
        MaxSendersCount: MAX_SENDERS_COUNT,
    };

    return getFolderChangeDigestOperation(getFolderChangeDigestRequest).then(response => {
        return response;
    });
}
