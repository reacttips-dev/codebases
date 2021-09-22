import BaseFilter from "../base/BaseFilter";
import { ICountryObject } from "services/CountryService";
import {
    CommonHeadquartersFilter,
    HeadquartersFilterDto,
    HeadquartersFilterDeps,
    HeadquartersFilterValueType,
} from "./types";
import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";

export default class HeadquartersFilter extends BaseFilter<HeadquartersFilterValueType>
    implements CommonHeadquartersFilter {
    readonly radioOptions: readonly string[];
    readonly countries: readonly ICountryObject[];

    constructor(deps: HeadquartersFilterDeps) {
        super(deps);

        this.radioOptions = deps.types;
        this.countries = deps.countries;
    }

    fromDto(dto: HeadquartersFilterDto) {
        const { codes, zip, inclusion } = dto;
        const value: HeadquartersFilterValueType = {
            codes,
            inclusion,
            type: this.radioOptions[1],
            zip: Array.isArray(zip) ? zip : [],
        };

        return this.setValue(value);
    }

    toDto() {
        const dto: Partial<HeadquartersFilterValueType> = {};
        const { codes, inclusion, zip } = this.getValue();

        dto.inclusion = inclusion;
        dto.codes = codes;

        if (zip.length > 0) {
            dto.zip = zip;
        }

        return {
            [this.key]: dto,
        };
    }

    compareValueWithDto(dto: HeadquartersFilterDto) {
        const { codes, inclusion, zip } = this.getValue();

        return (
            inclusion === dto.inclusion &&
            arraysHaveSamePrimitiveValues(codes, dto.codes) &&
            arraysHaveSamePrimitiveValues(zip, dto.zip ?? [])
        );
    }

    inInitialState() {
        return this.getValue().type === this.getInitialValue().type;
    }

    inReadyState() {
        return this.getValue().codes.length > 0;
    }

    protected getSummaryValue() {
        const { codes } = this.getValue();
        let summaryText = this.countries
            .filter((c) => codes.slice(0, 3).includes(c.id))
            .map((c) => c.text)
            .join(", ");

        if (codes.length > 3) {
            summaryText += ` +${codes.slice(3).length}`;
        }

        return summaryText;
    }
}
