import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

export const startAnswersSearchSession = action(
    'startAnswersSearchSession',
    (scenarioId: SearchScenarioId) => {
        return {
            scenarioId,
        };
    }
);
