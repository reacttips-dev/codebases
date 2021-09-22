import { orchestrator } from 'satcheljs';
import { getStore } from '../store/store';
import { getKey, SearchScope, SearchScopeKind } from 'owa-search-service';
import { onFolderScopeUpdate } from '../actions/internalActions';
import { logUsage } from 'owa-analytics';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { lazyIsSearchBoxEmpty } from 'owa-search';
import { onSearchScopeOptionSelected, startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';

orchestrator(onSearchScopeOptionSelected, async actionMessage => {
    const { searchScenarioType, selectedSearchScope } = actionMessage;

    if (searchScenarioType != SearchScenarioId.Mail) {
        return;
    }

    const {
        staticSearchScopeList: searchScopes,
        staticSearchScope: previousScope,
        initialSearchScope,
    } = getStore();

    let selectedScope = searchScopes.filter((scope: SearchScope) => {
        return getKey(scope) === selectedSearchScope;
    })[0];

    // In case of searching from subfolders and groups and changing scope from folder scope or advanced search filter, fall back on initialSearchScope
    if (!selectedScope) {
        selectedScope = initialSearchScope;
    }

    if (
        (previousScope.kind === SearchScopeKind.PrimaryMailbox &&
            selectedScope.kind === SearchScopeKind.PrimaryMailbox) ||
        (previousScope.kind === SearchScopeKind.ArchiveMailbox &&
            selectedScope.kind === SearchScopeKind.ArchiveMailbox)
    ) {
        logUsage('Search_FolderScopeChanged', [
            folderIdToName(previousScope.folderId),
            folderIdToName(selectedScope.folderId),
            selectedScope.kind,
            SearchScenarioId.Mail,
        ]);
    }

    onFolderScopeUpdate(selectedScope);

    // Kick off a search if the search box isn't empty.
    const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();
    if (!isSearchBoxEmpty(SearchScenarioId.Mail)) {
        startSearch('FolderScopeControl', SearchScenarioId.Mail, true /* explicitSearch */);
    }
});
