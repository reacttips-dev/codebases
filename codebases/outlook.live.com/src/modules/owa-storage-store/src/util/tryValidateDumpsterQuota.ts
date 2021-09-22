import { validateDumpsterQuota } from '../actions/validateDumpsterQuota';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function tryValidateDumpsterQuota(folderId: string) {
    if (
        folderNameToId('deleteditems') === folderId &&
        getUserConfiguration()?.SessionSettings?.IsDumpsterOverQuota
    ) {
        validateDumpsterQuota();
        return true;
    }
    return false;
}
