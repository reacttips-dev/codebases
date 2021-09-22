import BaseFilter from "../base/BaseFilter";
import { CommonRangeFilter, RangeFilterDeps, RangeFilterDto, RangeFilterValueType } from "./types";

export default class RangeFilter extends BaseFilter<RangeFilterValueType>
    implements CommonRangeFilter {
    readonly options: RangeFilterValueType;
    readonly hasName: boolean;

    constructor(deps: RangeFilterDeps) {
        super(deps);

        this.options = deps.options;
        this.hasName = deps.hasName ?? true;
    }

    formatValue(v: number) {
        return String(v);
    }

    getDisplayedValue(value?: number[]) {
        const valueToTake = value ?? this.getValue();
        const { from, to } = this.buildDto(valueToTake);

        if (typeof from === "undefined") {
            return this.translate("si.lead_gen_filters.range.to", {
                to: this.formatValue(to),
            });
        }

        if (typeof to === "undefined") {
            return this.translate("si.lead_gen_filters.range.from", {
                from: this.formatValue(from),
            });
        }

        return this.translate("si.lead_gen_filters.range.from_to", {
            from: this.formatValue(from),
            to: this.formatValue(to),
        });
    }

    inInitialState() {
        const [from, to] = this.getValue();
        const [initialFrom, initialTo] = this.getInitialValue();

        return from === initialFrom && to === initialTo;
    }

    fromDto(dto: RangeFilterDto) {
        const [initialFrom, initialTo] = this.getInitialValue();
        const newValue: RangeFilterValueType = [dto.from ?? initialFrom, dto.to ?? initialTo];

        return this.setValue(newValue);
    }

    toDto() {
        return {
            [this.key]: this.buildDto(this.getValue()),
        };
    }

    compareValueWithDto(dto: RangeFilterDto) {
        const { from, to } = this.toDto()[this.key];

        return dto.from === from && dto.to === to;
    }

    protected getSummaryValue() {
        return this.getDisplayedValue();
    }

    private buildDto(value: RangeFilterValueType): RangeFilterDto {
        const [from, to] = value;
        const [initialFrom, initialTo] = this.getInitialValue();

        if (from === initialFrom && to !== initialTo) {
            return { to };
        }

        if (from !== initialFrom && to === initialTo) {
            return { from };
        }

        return { from, to };
    }
}
