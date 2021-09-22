import { CommonRangeFilter } from "../range/types";
import { SupportedFilterKey } from "../../types/filters";
import { TranslateFunction } from "app/@types/I18nInterfaces";
import { RANGE_DURATION_FILTERS_CONFIG } from "../../configuration/filters";
import RangeDurationFilter from "./RangeDurationFilter";

export default function createRangeDurationFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
): CommonRangeFilter {
    const options = RANGE_DURATION_FILTERS_CONFIG[key];
    const initialValue = [options[0], options[options.length - 1]];

    return new RangeDurationFilter({
        key,
        options,
        translate,
        initialValue,
    });
}
