import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import {
    primaryMailboxSearchScope,
    PrivateDistributionListSuggestion,
    SuggestionKind,
    SearchScopeKind,
} from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import createPrivateDistributionListSearchQueryString from './createPrivateDistributionListSearchQueryString';
import type { PrivateDistributionListMember } from 'owa-persona-models';
import { defaultMailSearchStore } from '../store/store';

// We use this tableQuery for fallback favorite persona search which is triggered while
// the search folder persona is being populated.
export default function createFallbackPrivateDistributionListSearchTableQuery(
    displayName: string,
    emailAddresses: PrivateDistributionListMember[],
    pdlId: string,
    owsPersonaId: string,
    listViewType: ReactListViewType,
    doNotShowPillSuggestions: boolean = false
): TableQuery {
    const pdl: PrivateDistributionListSuggestion = {
        kind: SuggestionKind.PrivateDistributionList,
        DisplayName: displayName,
        HighlightedDisplayName: displayName,
        Members: emailAddresses,
        PdlId: pdlId,
        OwsPersonaId: owsPersonaId,
        ReferenceId: undefined,
        Attributes: undefined,
        Source: 'none',
    };

    const rootFolderId = primaryMailboxSearchScope({
        folderId: folderNameToId('msgfolderroot'),
        kind: SearchScopeKind.PrimaryMailbox,
    });

    const searchTableQuery: SearchTableQuery = {
        folderId: null,
        searchNumber: null,
        type: TableQueryType.Search,
        listViewType: listViewType,
        searchScope: rootFolderId,
        queryString: createPrivateDistributionListSearchQueryString(pdl, rootFolderId),
        pillSuggestions: doNotShowPillSuggestions ? [] : [pdl],
        includeAttachments: defaultMailSearchStore.includeAttachments,
        fromDate: defaultMailSearchStore.fromDate,
        toDate: defaultMailSearchStore.toDate,
        scenarioType: 'privateDistributionList',
    };

    return searchTableQuery;
}
