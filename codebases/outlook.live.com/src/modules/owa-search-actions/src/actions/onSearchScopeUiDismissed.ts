import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onSearchScopeUiDismissed = action(
    'onSearchScopeUiDismissed',
    (searchScenarioType: SearchScenarioId) => ({
        searchScenarioType,
    })
);
