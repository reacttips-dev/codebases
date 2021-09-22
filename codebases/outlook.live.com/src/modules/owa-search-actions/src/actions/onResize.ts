import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onResize = action(
    'ON_RESIZE_SUGGESTIONSCALLOUT',
    (searchBoxWidth: number, scenarioId: SearchScenarioId) => ({ searchBoxWidth, scenarioId })
);
