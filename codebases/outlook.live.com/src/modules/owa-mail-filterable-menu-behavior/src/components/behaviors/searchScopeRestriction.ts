import { xor } from './utils/xor';
import type { SearchScopeKind } from 'owa-search-service/lib/data/schema/SearchScope';
import { getSelectedTableView, TableQueryType } from 'owa-mail-list-store';
import { getStore as getMailSearchStore } from 'owa-mail-search/lib/store/store';

export const searchScopeRestriction = (
    searchScopes: SearchScopeKind[],
    shouldHide?: boolean
) => () => {
    const {
        tableQuery: { type },
    } = getSelectedTableView();
    if (type !== TableQueryType.Search) {
        return true;
    }
    const staticSearchScope = getMailSearchStore().staticSearchScope;
    const isCurrentSearchScopeInRestriction =
        staticSearchScope && searchScopes.includes(staticSearchScope.kind);
    return xor(shouldHide, isCurrentSearchScopeInRestriction);
};
