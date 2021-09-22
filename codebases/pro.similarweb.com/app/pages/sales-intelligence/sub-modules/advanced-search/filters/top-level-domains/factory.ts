import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import TopLevelDomainsFilter from "./TopLevelDomainsFilter";
import { CommonTopLevelDomainsFilter } from "./types";

export default function createTopLevelDomainsFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    types: readonly string[],
): CommonTopLevelDomainsFilter {
    const initialValue = {
        type: types[0],
        domains: [],
    };

    return new TopLevelDomainsFilter({
        key,
        types,
        translate,
        initialValue,
    });
}
