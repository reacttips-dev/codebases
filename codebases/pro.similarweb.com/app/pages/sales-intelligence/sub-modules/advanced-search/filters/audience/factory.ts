import { TranslateFunction } from "app/@types/I18nInterfaces";
import { FILTER_ANY_OPTION, FILTER_INCLUDE_OPTION } from "../../constants/filters";
import { FiltersConfigResponseDto } from "../../types/common";
import { CommonAudienceFilter } from "./types";
import AudienceFilter from "./AudienceFilter";

export default function createAudienceFilter(
    translate: TranslateFunction,
    key: "audienceAgeGroups" | "audienceGenderSplits",
    items: FiltersConfigResponseDto[typeof key],
): CommonAudienceFilter {
    const types = [FILTER_ANY_OPTION, FILTER_INCLUDE_OPTION];
    const initialValue = {
        type: types[0],
        ids: [],
    };

    return new AudienceFilter({
        key,
        types,
        items,
        translate,
        initialValue,
    });
}
