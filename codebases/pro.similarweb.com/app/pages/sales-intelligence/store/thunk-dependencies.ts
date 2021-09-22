import { i18nFilter } from "filters/ngFilters";
import { SalesIntelligenceThunkDeps } from "pages/sales-intelligence/types";
import salesApiService from "../services/salesApiService";
import salesSettingsHelper from "../services/salesSettingsHelper";
import createFiltersManager from "../sub-modules/advanced-search/services/filtersManager";
import advancedSearchSettingsService from "../sub-modules/advanced-search/services/advancedSearchSettingsService";

const siThunkDependencies: SalesIntelligenceThunkDeps = {
    api: salesApiService,
    settingsHelper: salesSettingsHelper,
    advancedSearchFiltersManager: createFiltersManager({
        translate: i18nFilter(),
        settingsService: advancedSearchSettingsService,
    }),
};

export default siThunkDependencies;
