import type { SearchScope } from 'owa-search-service';
import { getStore } from '../store/store';

export default function getSelectedSearchScope(): SearchScope {
    const { staticSearchScope: selectedSearchScope, advancedSearchViewState } = getStore();

    return advancedSearchViewState.selectedSearchScope || selectedSearchScope;
}
