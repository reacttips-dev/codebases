import BaseFilter from "../base/BaseFilter";
import { CommonCheckboxFilter, CheckboxFilterDeps } from "./types";

export default class CheckboxFilter extends BaseFilter<boolean> implements CommonCheckboxFilter {
    readonly name: string;
    readonly tooltip: string;

    constructor(deps: CheckboxFilterDeps) {
        super(deps);

        this.name = deps.name;
        this.tooltip = deps.tooltip;
    }

    getSummary() {
        return {
            name: null,
            filterKey: this.key,
            value: this.translate(`si.lead_gen_filters.${this.key}.summary.value`),
        };
    }
}
