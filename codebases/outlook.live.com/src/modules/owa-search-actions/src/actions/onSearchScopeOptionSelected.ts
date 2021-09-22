import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

export const onSearchScopeOptionSelected = action(
    'onSearchScopeOptionSelected',
    (selectedSearchScope: string, searchScenarioType: SearchScenarioId) => ({
        selectedSearchScope,
        searchScenarioType,
    })
);
