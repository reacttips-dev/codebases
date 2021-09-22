import { CommonWebsiteTypeFilter } from "./types";
import { SupportedFilterKey } from "../../types/filters";
import { TranslateFunction } from "app/@types/I18nInterfaces";
import { FiltersConfigResponseDto } from "../../types/common";
import { FILTER_ANY_OPTION } from "../../constants/filters";
import WebsiteTypeFilter from "./WebsiteTypeFilter";
import { getOrderedWebsiteTypes } from "../../helpers/filters";

export default function createWebsiteTypeFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    config: FiltersConfigResponseDto["websiteType"],
): CommonWebsiteTypeFilter {
    const { types } = config;
    const possibleValues = [FILTER_ANY_OPTION].concat(getOrderedWebsiteTypes(types.slice()));
    const initialValue = possibleValues[0];

    return new WebsiteTypeFilter({
        key,
        translate,
        initialValue,
        possibleValues,
    });
}
