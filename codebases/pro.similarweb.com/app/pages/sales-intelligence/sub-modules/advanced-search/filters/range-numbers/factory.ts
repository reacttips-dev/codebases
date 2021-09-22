import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import { CommonRangeFilter } from "../range/types";
import RangeNumbersFilter from "./RangeNumbersFilter";

export default function createRangeNumbersFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    options: number[],
    hasName = true,
): CommonRangeFilter {
    const initialValue = [options[0], options[options.length - 1]];

    return new RangeNumbersFilter({
        key,
        hasName,
        options,
        translate,
        initialValue,
    });
}
