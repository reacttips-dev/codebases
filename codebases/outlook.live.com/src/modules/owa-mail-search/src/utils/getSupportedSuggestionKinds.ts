import { SearchScenarioId } from 'owa-search-store';
import {
    SUPPORTED_FILESHUB_SUGGESTION_KIND_LIST,
    ALL_SUGGESTION_KINDS_LIST,
} from '../store/schema/constants';
import isSharedFolderSearch from '../utils/isSharedFolderSearch';
import { SuggestionKind } from 'owa-search-service';

export default function getSupportedSuggestionKinds(scenarioId: SearchScenarioId) {
    if (scenarioId === SearchScenarioId.FilesHub) {
        return SUPPORTED_FILESHUB_SUGGESTION_KIND_LIST;
    } else {
        return isSharedFolderSearch()
            ? getSupportedSharedFolderSuggestions()
            : ALL_SUGGESTION_KINDS_LIST;
    }
}

function getSupportedSharedFolderSuggestions(): SuggestionKind[] {
    /* Search in shared folders is only supported for keywords and people
        The message/file/category item suggestions are not in context of shared folders */
    return [SuggestionKind.Keywords, SuggestionKind.People];
}
