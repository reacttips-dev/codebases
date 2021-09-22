import { lazySearchDiagnostics } from '../lazyModule';
import type { SearchRequestInstrumentation } from 'owa-search-service';

export const getSearchRequestInstrumentation = (): SearchRequestInstrumentation[] => {
    const searchDiagnostics = lazySearchDiagnostics.tryImportForRender();
    const searchDiagnosticsStore = searchDiagnostics ? searchDiagnostics.getIfInitialized() : null;

    return searchDiagnosticsStore ? searchDiagnosticsStore.searchInstrumentationList : [];
};
