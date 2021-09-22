import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SearchHeaderType } from '../store/schema/SearchHeaderType';

export default function shouldShowModifiedQueryInformationalView(
    searchHeaderType: SearchHeaderType = SearchHeaderType.Mail
) {
    const { queryAlterationType } = getScenarioStore(SearchScenarioId.Mail);

    return (
        searchHeaderType == SearchHeaderType.Mail ||
        queryAlterationType === 'NoResultFolderRefinerModification'
    );
}
