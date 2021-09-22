import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import BaseFilter from "../base/BaseFilter";
import {
    CommonTopLevelDomainsFilter,
    TopLevelDomainsFilterDeps,
    TopLevelDomainsFilterDto,
    TopLevelDomainsFilterValueType,
} from "./types";

export default class TopLevelDomainsFilter extends BaseFilter<TopLevelDomainsFilterValueType>
    implements CommonTopLevelDomainsFilter {
    private readonly SUMMARY_LIMIT = 5;
    readonly radioOptions: readonly string[];

    constructor(deps: TopLevelDomainsFilterDeps) {
        super(deps);

        this.radioOptions = deps.types;
    }

    fromDto(dto: TopLevelDomainsFilterDto) {
        const { type, values } = dto;
        const v: TopLevelDomainsFilterValueType = {
            type,
            domains: values,
        };

        return this.setValue(v);
    }

    toDto() {
        const { type, domains } = this.getValue();

        return {
            [this.key]: {
                type,
                values: domains,
            },
        };
    }

    compareValueWithDto(dto: TopLevelDomainsFilterDto) {
        const currentValueDto = this.toDto()[this.key];

        return (
            currentValueDto.type === dto.type &&
            arraysHaveSamePrimitiveValues(currentValueDto.values, dto.values)
        );
    }

    inInitialState() {
        const { type, domains } = this.getValue();

        return type === this.getInitialValue().type && domains.length === 0;
    }

    inReadyState() {
        return this.getValue().domains.length > 0;
    }

    protected getSummaryValue() {
        const { type, domains } = this.getValue();

        let summaryText = domains.slice(0, this.SUMMARY_LIMIT).join(", ");

        if (domains.length > this.SUMMARY_LIMIT) {
            summaryText += ` +${domains.slice(this.SUMMARY_LIMIT).length}`;
        }

        return `${this.translate(`si.lead_gen_filters.${this.key}.type.${type}`)} ${summaryText}`;
    }
}
