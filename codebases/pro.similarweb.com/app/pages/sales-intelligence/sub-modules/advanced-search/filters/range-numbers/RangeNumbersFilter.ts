import RangeFilter from "../range/RangeFilter";
import { formatLargeNumber } from "pages/workspace/sales/sub-modules/benchmarks/helpers";
import { MAX_OPTION_VALUE } from "pages/lead-generator/lead-generator-new/filters-options";
import { INFINITY_CHARACTER_DECIMAL_CODE } from "pages/lead-generator/lead-generator-new/constants";

export default class RangeNumbersFilter extends RangeFilter {
    formatValue(value: number) {
        if (value === MAX_OPTION_VALUE) {
            return String.fromCharCode(INFINITY_CHARACTER_DECIMAL_CODE);
        }

        return formatLargeNumber(value);
    }
}
