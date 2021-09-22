import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import { IFlattenedCategory } from "common/services/categoryService.types";
import BaseFilter from "../base/BaseFilter";
import {
    CommonWebsiteIndustryFilter,
    WebsiteIndustryFilterDeps,
    WebsiteIndustryFilterDto,
    WebsiteIndustryFilterValueType,
} from "./types";

export default class WebsiteIndustryFilter extends BaseFilter<WebsiteIndustryFilterValueType>
    implements CommonWebsiteIndustryFilter {
    readonly radioOptions: readonly string[];
    readonly items: readonly IFlattenedCategory[];

    constructor(deps: WebsiteIndustryFilterDeps) {
        super(deps);

        this.items = deps.categories;
        this.radioOptions = deps.types;
    }

    fromDto(dto: WebsiteIndustryFilterDto) {
        const ids = dto.filter((id) => id !== "ALL");

        if (ids.length === 0) {
            return this.setValue(this.getInitialValue());
        }

        return this.setValue({
            ids: ids.map((id) => id.replace(/\//g, "~")),
            type: this.radioOptions[1],
        });
    }

    toDto() {
        return {
            [this.key]: this.getValue().ids.map((id) => id.replace(/~/g, "/")),
        };
    }

    compareValueWithDto(dto: WebsiteIndustryFilterDto) {
        return arraysHaveSamePrimitiveValues(
            this.toDto()[this.key],
            dto.filter((id) => id !== "ALL"),
        );
    }

    inInitialState() {
        return this.getValue().type === this.getInitialValue().type;
    }

    inReadyState() {
        return this.getValue().ids.length > 0;
    }

    protected getSummaryValue() {
        const { ids } = this.getValue();
        let summaryText = this.items
            .filter((c) => ids.slice(0, 2).includes(c.id))
            .map((c) => c.text)
            .join(", ");

        if (ids.length > 2) {
            summaryText += ` +${ids.slice(2).length}`;
        }

        return summaryText;
    }
}
