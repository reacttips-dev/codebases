import { InclusionEnum } from "../../../../common-components/dropdown/InclusionDropdown/InclusionDropdown";
import { FILTER_ANY_OPTION, FILTER_ONLY_OPTION } from "../../constants/filters";
import { AdvancedSearchSettingsService } from "../../types/services";
import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import HeadquartersFilter from "./HeadquartersFilter";
import { CommonHeadquartersFilter } from "./types";

export default function createHeadquartersFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    settingsService: AdvancedSearchSettingsService,
): CommonHeadquartersFilter {
    const types = [FILTER_ANY_OPTION, FILTER_ONLY_OPTION];
    const countries = settingsService.getCompanyInformationCountries();
    const initialValue = {
        type: types[0],
        inclusion: InclusionEnum.includeOnly,
        codes: [],
        zip: [],
    };

    return new HeadquartersFilter({
        key,
        types,
        translate,
        countries,
        initialValue,
    });
}
