import RangeFilter from "../range/RangeFilter";
import { addPercentAtTheEnd } from "pages/workspace/sales/sub-modules/benchmarks/helpers";

export default class RangePercentsFilter extends RangeFilter {
    formatValue(value: number) {
        return addPercentAtTheEnd(Math.floor(value * 100));
    }
}
