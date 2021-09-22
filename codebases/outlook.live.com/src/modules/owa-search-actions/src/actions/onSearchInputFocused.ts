import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';
import { addDatapointConfig } from 'owa-analytics-actions';

export const onSearchInputFocused = action(
    'ON_SEARCH_INPUT_FOCUSED',
    (scenarioId: SearchScenarioId) =>
        addDatapointConfig({ name: 'ON_SEARCH_INPUT_FOCUSED' }, { scenarioId })
);
