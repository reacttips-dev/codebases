import { TranslateFunction } from "app/@types/I18nInterfaces";
import { SupportedFilterKey } from "../../types/filters";
import { PERCENTAGE_OPTIONS } from "pages/lead-generator/lead-generator-new/filters-options";
import RangePercentsFilter from "./RangePercentsFilter";
import { CommonRangeFilter } from "../range/types";

export default function createRangePercentsFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
): CommonRangeFilter {
    const options = PERCENTAGE_OPTIONS.map((v) => v / 100);
    const initialValue = [options[0], options[options.length - 1]];

    return new RangePercentsFilter({
        key,
        options,
        translate,
        initialValue,
    });
}
