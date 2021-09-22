import { SearchScope, SearchScopeKind } from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Return TRUE if search scope is 'Notes' folder and 'notes-folder-view' is enabled.
 * Determines if scope shouldbe shown in scope picker or if element (suggestions, scope picker)
 * should be shown in specified scope
 * @param scope Search scope
 *
 */
export default function shouldShowInScopeSelector(scope: SearchScope) {
    return !(
        scope != null &&
        isFeatureEnabled('notes-folder-view') &&
        scope.kind == SearchScopeKind.PrimaryMailbox &&
        folderNameToId('notes') == scope.folderId
    );
}
