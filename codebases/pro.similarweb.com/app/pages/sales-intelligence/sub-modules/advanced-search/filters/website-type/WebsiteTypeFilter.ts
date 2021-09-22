import BaseFilter from "../base/BaseFilter";
import { CommonWebsiteTypeFilter, WebsiteTypeFilterDeps, WebsiteTypeFilterDto } from "./types";

export default class WebsiteTypeFilter extends BaseFilter<string>
    implements CommonWebsiteTypeFilter {
    readonly possibleValues: readonly string[];

    constructor(deps: WebsiteTypeFilterDeps) {
        super(deps);

        this.possibleValues = deps.possibleValues;
    }

    fromDto(dto: WebsiteTypeFilterDto) {
        return this.setValue(dto.type);
    }

    toDto() {
        return {
            [this.key]: {
                type: this.getValue(),
                inclusion: "includeOnly",
            },
        };
    }

    compareValueWithDto(dto: WebsiteTypeFilterDto) {
        return this.getValue() === dto.type;
    }

    protected getSummaryValue() {
        return this.translate(`si.lead_gen_filters.${this.key}.${this.getValue()}`);
    }
}
