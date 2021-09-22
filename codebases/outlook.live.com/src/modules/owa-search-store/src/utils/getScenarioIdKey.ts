import { SearchScenarioId } from '../store/schema/SearchScenarioId';

/**
 * Converts given scenarioId to a string (to be used as map key).
 * @param scenarioId ID representing search scenario
 */
export default function getScenarioIdKey(scenarioId: SearchScenarioId): string {
    switch (scenarioId) {
        case SearchScenarioId.Mail:
            return 'Mail';
        case SearchScenarioId.Calendar:
            return 'Calendar';
        case SearchScenarioId.FilesHub:
            return 'FilesHub';
        case SearchScenarioId.FilesPicker:
            return 'FilesPicker';
        case SearchScenarioId.Spaces:
            return 'Spaces';
        case SearchScenarioId.FileSuggestions:
            return 'FileSuggestions';
        case SearchScenarioId.Yulee:
            return 'Yulee';
        default:
            throw Error('Unknown SearchScenarioId value!');
    }
}
