import { default as getSelectedSearchScope } from './getSelectedSearchScope';
import { default as getSearchScopeDisplayName } from './getSearchScopeDisplayName';
import { getStore } from '../store/store';

export default function getSelectedSearchScopeDisplayName(): string {
    if (!getStore().initialSearchScope) {
        return null;
    }

    const selectedSearchScope = getSelectedSearchScope();
    const selectedFolderScope = getSearchScopeDisplayName(
        selectedSearchScope,
        true /* isSearchFromFolderScope*/
    );

    return selectedFolderScope;
}
