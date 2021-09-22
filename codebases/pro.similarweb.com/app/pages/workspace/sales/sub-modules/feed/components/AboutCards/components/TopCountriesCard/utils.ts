import { formatWithAbbrNumbers, formatWithPercents } from "../../utils";
import { TOP_COUNTRIES_NEW_COUNTRY } from "../../../../constants";

export const prepareCountries = {
    topCountriesByShare: ({ share, country, visits }, _translate) => ({
        share: `${formatWithPercents("" + share, 1)}%`,
        visits: formatWithAbbrNumbers(visits),
        country,
    }),
    topCountriesByGrowth: ({ country, change, visits, isNew }, translate) => ({
        country: { country, isNew, labelNew: translate(TOP_COUNTRIES_NEW_COUNTRY) },
        change,
        visits: formatWithAbbrNumbers(visits),
    }),
};
