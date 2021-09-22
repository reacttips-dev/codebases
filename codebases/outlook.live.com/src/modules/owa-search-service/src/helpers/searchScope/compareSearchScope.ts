import { getKey } from './SearchScenario';
import type { SearchScope } from '../../data/schema/SearchScope';

export default function compareSearchScope(
    searchScopeA: SearchScope,
    searchScopeB: SearchScope
): boolean {
    if (searchScopeA && searchScopeB) {
        return getKey(searchScopeA) === getKey(searchScopeB);
    }

    return false;
}
