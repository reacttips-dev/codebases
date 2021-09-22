import { xor } from './utils/xor';
import { getSelectedTableView, TableQueryType, TableView } from 'owa-mail-list-store';
import {
    primaryMailboxSearchScope,
    SearchScopeKind,
} from 'owa-search-service/lib/data/schema/SearchScope';
import compareSearchScope from 'owa-search-service/lib/helpers/searchScope/compareSearchScope';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getStore as getMailSearchStore } from 'owa-mail-search/lib/store/store';

export const staticFolderSearchScopeRestriction = (
    staticFolders: string[],
    shouldHide?: boolean
) => () => {
    const tableView: TableView = getSelectedTableView();

    if (tableView.tableQuery.type !== TableQueryType.Search) {
        return true;
    }

    const staticSearchScope = getMailSearchStore().staticSearchScope;

    const isStaticFolderInRestrictionList =
        staticFolders
            .map(distinguishedFolderId =>
                primaryMailboxSearchScope({
                    folderId: folderNameToId(distinguishedFolderId),
                    kind: SearchScopeKind.PrimaryMailbox,
                })
            )
            .filter(searchScope => compareSearchScope(searchScope, staticSearchScope)).length > 0;

    return xor(shouldHide, isStaticFolderInRestrictionList);
};
