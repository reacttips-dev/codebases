import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import BaseFilter from "../base/BaseFilter";
import {
    AudienceFilterDeps,
    AudienceFilterDto,
    AudienceFilterValueType,
    CommonAudienceFilter,
} from "./types";

export default class AudienceFilter extends BaseFilter<AudienceFilterValueType>
    implements CommonAudienceFilter {
    readonly items: readonly string[];
    readonly radioOptions: readonly string[];

    constructor(deps: AudienceFilterDeps) {
        super(deps);

        this.items = deps.items;
        this.radioOptions = deps.types;
    }

    fromDto(dto: AudienceFilterDto) {
        const value: AudienceFilterValueType = {
            type: this.radioOptions[1],
            ids: dto,
        };

        return this.setValue(value);
    }

    toDto() {
        return {
            [this.key]: this.getValue().ids,
        };
    }

    compareValueWithDto(dto: AudienceFilterDto) {
        return arraysHaveSamePrimitiveValues(this.toDto()[this.key], dto);
    }

    inInitialState() {
        return this.getValue().type === this.getInitialValue().type;
    }

    inReadyState() {
        return this.getValue().ids.length > 0;
    }

    protected getSummaryValue() {
        const { ids } = this.getValue();

        if (ids.length <= 3) {
            return this.translateGivenSummaryValue(ids);
        }

        const firstIds = ids.slice(0, 3);
        const idsLeft = ids.slice(3);

        return `${this.translateGivenSummaryValue(firstIds)} +${idsLeft.length}`;
    }

    private translateGivenSummaryValue(ids: readonly string[]) {
        return ids.map((id) => this.translate(`si.lead_gen_filters.${this.key}.${id}`)).join(", ");
    }
}
