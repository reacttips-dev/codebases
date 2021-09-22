import BaseFilter from "../base/BaseFilter";
import { ICountryObject } from "services/CountryService";
import { WORLDWIDE_COUNTRY_ID } from "pages/sales-intelligence/constants/common";
import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";
import {
    CommonVisitFromFilter,
    VisitFromFilterValueType,
    VisitsFromFilterDeps,
    VisitFromFilterDto,
} from "./types";

export default class VisitsFromFilter extends BaseFilter<VisitFromFilterValueType>
    implements CommonVisitFromFilter {
    readonly countries: readonly ICountryObject[];
    private readonly countryIdToCountry: Readonly<{ [key: string]: ICountryObject }>;
    private device: "Total" | "Desktop"; // TODO: Separate type is preferable

    constructor(deps: VisitsFromFilterDeps) {
        super(deps);

        this.device = "Total";
        this.countries = deps.countries;
        this.countryIdToCountry = deps.countries.reduce((map, country) => {
            map[country.id] = country;
            return map;
        }, {});
    }

    isWorldwideAvailable() {
        return typeof this.countryIdToCountry[WORLDWIDE_COUNTRY_ID] !== "undefined";
    }

    getCurrentCountriesNames() {
        return this.getValue().reduce<ICountryObject["text"][]>((names, id) => {
            const name = this.countryIdToCountry[id]?.text;

            if (name) {
                names.push(name);
            }

            return names;
        }, []);
    }

    inInitialState() {
        if (arraysHaveSamePrimitiveValues(this.getInitialValue(), this.getValue())) {
            return true;
        }

        return this.getInitialValue() === this.getValue();
    }

    inReadyState() {
        // This filter should be always in its ready state
        return true;
    }

    toDto() {
        return {
            [this.key]: this.getValue(),
            device: this.resolveDeviceFromCurrentValue(),
        };
    }

    compareValueWithDto(dto: VisitFromFilterDto) {
        return arraysHaveSamePrimitiveValues(this.toDto()[this.key] as VisitFromFilterDto, dto);
    }

    protected getSummaryValue() {
        const ids = this.getValue();
        let summaryText = this.countries
            .filter((c) => ids.slice(0, 3).includes(c.id))
            .map((c) => c.text)
            .join(", ");

        if (ids.length > 3) {
            summaryText += ` +${ids.slice(3).length}`;
        }

        return summaryText;
    }

    private resolveDeviceFromCurrentValue() {
        const hasAtLeastOneWithOnlyDesktop = this.getValue().some((id) => {
            return this.countryIdToCountry[id]?.mobileWeb === false;
        });

        return hasAtLeastOneWithOnlyDesktop ? "Desktop" : "Total";
    }
}
