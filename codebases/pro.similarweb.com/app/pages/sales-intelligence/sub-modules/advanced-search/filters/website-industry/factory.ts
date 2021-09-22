import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import { AdvancedSearchSettingsService } from "../../types/services";
import { FILTER_ANY_OPTION, FILTER_INCLUDE_OPTION } from "../../constants/filters";
import WebsiteIndustryFilter from "./WebsiteIndustryFilter";

export default function createWebsiteIndustryFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    settingsService: AdvancedSearchSettingsService,
) {
    const types = [FILTER_ANY_OPTION, FILTER_INCLUDE_OPTION];
    const initialValue = {
        type: FILTER_ANY_OPTION,
        ids: [],
    };
    const categories = settingsService
        .getCurrentComponentCategories()
        .filter((c) => c.id !== "All");

    return new WebsiteIndustryFilter({
        key,
        types,
        translate,
        categories,
        initialValue,
    });
}
