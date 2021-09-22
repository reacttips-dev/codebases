import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import { CommonTextSearchFilter } from "./types";
import TextSearchFilter from "./TextSearchFilter";

export default function createTextSearchFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
): CommonTextSearchFilter {
    const initialValue = "";
    const placeholder = translate("si.components.advanced_search_results_table.search_placeholder");

    return new TextSearchFilter({
        key,
        translate,
        placeholder,
        initialValue,
    });
}
