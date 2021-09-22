import { swNumberFilter } from "filters/ngFilters";
import { ICountryObject } from "services/CountryService";
import { getTimeDurationString } from "pages/workspace/sales/helpers";
import {
    addUnitAtTheEnd,
    formatAsPercents,
    formatLargeNumber,
} from "pages/workspace/sales/sub-modules/benchmarks/helpers";
import { TypesOfUnits, WORLDWIDE_COUNTRY_ID } from "pages/workspace/sales/sub-modules/constants";
import { offsetMonth } from "pages/workspace/sales/sub-modules/site-trends/constants";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const checkIsAccessibleMode = (currentModule: string): boolean => {
    return !["apps", "keywords", "appcategory"].includes(currentModule);
};

/**
 * Returns proper value based on given units
 * @param units
 */
export const getValueFormatterByUnits = (units: string) => (value: number) => {
    if (units === TypesOfUnits.PERCENT) {
        return formatAsPercents(value);
    }

    if (units === TypesOfUnits.SECONDS) {
        return getTimeDurationString(value);
    }

    const withUnits = addUnitAtTheEnd(units);

    if (value >= 1000) {
        return withUnits(formatLargeNumber(value));
    }

    return withUnits(swNumberFilter()(value, 2));
};

export const setGraphData = (values) => {
    const data = values.map((item, index: number) => ({
        x: new Date(item.date).getTime(),
        y: item.value,
        marker: setUpMarker(index, values.length),
    }));
    return [
        {
            data,
            zones: [
                {
                    value: data[data.length - offsetMonth].x,
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1,
                        },
                        stops: [
                            [0, rgba(colorsPalettes.blue[400], 0.2)],
                            [1, rgba(colorsPalettes.blue[400], 0.05)],
                        ],
                    },
                },
            ],
            zoneAxis: "x",
            type: "area",
        },
    ];
};

export const setUpMarker = (index: number, length: number) => {
    if (length - index === 1 || length - index === offsetMonth) {
        return {
            enabled: true,
            fillColor: colorsPalettes.blue[400],
        };
    }
    return {};
};

export const findWordWideCountry = (allowedCountries: ICountryObject[]): ICountryObject => {
    return allowedCountries.find((country) => country.id === WORLDWIDE_COUNTRY_ID);
};
