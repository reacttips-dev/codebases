import { compose } from "redux";
import { ICountryObject } from "services/CountryService";
import dateTimeService from "services/date-time/dateTimeService";
import { abbrNumberFilter, simplePercentageFilter, swNumberFilter } from "filters/ngFilters";
import { BaseWebsiteType, CountrySharesByCountryId, WebsiteWithIsProspect } from "./types/common";
import * as _ from "lodash";
import {
    AggregatedDetailsType,
    BenchmarkResultGrowthType,
    BenchmarkResultType,
    BenchmarkType,
    ProspectType,
} from "./types/benchmarks";
import { GroupedTopics, TopicType } from "./types/topics";
import { BenchmarkCompetitorType } from "./types/competitors";
import {
    BENCHMARK_COMPETITORS_MAX_COUNT,
    BENCHMARK_ITEM_KEY,
    BENCHMARK_VALUE_PRECISION,
    BENCHMARKS_BAR_CHART_BASE_HEIGHT,
    BenchmarksValuesUnits,
    OpportunityMode,
} from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { compareNumericPropDesc, getTimeDurationString } from "../../helpers";
import { BENCHMARK_COMPETITORS_COLORS, BENCHMARK_PROSPECT_COLOR } from "./constants";
import { isNotEmptyObject } from "../../utils/object";
import { WORLDWIDE_COUNTRY_ID } from "../constants";

const percentageFilter = simplePercentageFilter();
export const formatLargeNumber: (v: number) => string = abbrNumberFilter();
const smallNumberFilter = swNumberFilter();

/**
 * Adds given unit to the end of the given value
 * @param unit
 */
export const addUnitAtTheEnd = (unit = "") => (value: number | string) => {
    return `${value}${unit}`;
};

/**
 * Adds "%" to the end of the given value
 * @param unit
 */
export const addPercentAtTheEnd = addUnitAtTheEnd(BenchmarksValuesUnits.PERCENT);

/**
 * Multiplies given number by 100, rounds with precision of {BENCHMARK_VALUE_PRECISION} and adds "%" to it
 * @example
 * `
 *   formatAsPercents(0.3455764) -> "34.56%"
 * `
 */
export const formatAsPercents = (value: number) => {
    return addPercentAtTheEnd(percentageFilter(value, BENCHMARK_VALUE_PRECISION));
};

/**
 * Multiplies given number by 100, rounds with precision of {BENCHMARK_VALUE_PRECISION}
 * @example
 * `
 *   formatValueByPercents(0.3455764) -> "34.56"
 * `
 */
export const formatValueByPercents = (value: number): string => {
    return percentageFilter(value, BENCHMARK_VALUE_PRECISION);
};

/**
 * Properly formats "opportunity" value
 */
export const formatOpportunityValue = (value: number) => {
    return formatAsPercents(Math.abs(value));
};

export const addCorrectOpportunityValueSign = (value: string, greaterIsBetter: boolean) => {
    if (greaterIsBetter) {
        return `+${value}`;
    }

    return `-${value}`;
};

export const getOpportunityItemValue = (
    aggregatedDetails: AggregatedDetailsType,
    opportunityMode: OpportunityMode,
    greaterIsBetter: boolean,
): string => {
    const value = typeof aggregatedDetails !== "undefined" ? aggregatedDetails.opportunity : 0;

    if (value === 0) {
        return "N/A";
    }

    const formattedValue = formatOpportunityValue(value);

    if (opportunityMode === OpportunityMode.Opportunity) {
        return addCorrectOpportunityValueSign(formattedValue, greaterIsBetter);
    }

    return formattedValue;
};

export const getSummaryAverageItemValue = (
    aggregatedDetails: AggregatedDetailsType,
    units: BenchmarkType["units"],
) => {
    const value = typeof aggregatedDetails !== "undefined" ? aggregatedDetails.avgValue : 0;

    if (value === 0) {
        return "N/A";
    }

    return getSummaryValueFormatterByUnits(units)(value);
};

/**
 * Add prefix to the value depends on type of benchmarks. For paid_search_bounce_rate add sign "-", for other "+";
 *  @param value
 *  @param benchmark
 *
 * @example
 * `
 *   prefixSignByBenchmarkType(0.3455764, "paid_search_bounce_rate") -> "-34.56"
 * `
 */

export const prefixSignByBenchmarkType = (value: string, benchmark: string): string => {
    if (benchmark === "paid_search_bounce_rate") {
        return `-${value}`;
    }
    return `+${value}`;
};

/**
 * Returns proper value based on given units
 */
export const getSummaryValueFormatterByUnits = (units = "") => (value: number) => {
    if (units === BenchmarksValuesUnits.PERCENT) {
        return formatAsPercents(value);
    }

    if (units === BenchmarksValuesUnits.SECONDS) {
        return getTimeDurationString(value);
    }

    const withUnits = addUnitAtTheEnd(units);

    if (Math.abs(value) >= 1000) {
        const formattedValue = withUnits(formatLargeNumber(Math.abs(value)));

        return Math.sign(value) < 0 ? `-${formattedValue}` : formattedValue;
    }

    return withUnits(smallNumberFilter(value, 2));
};

export const hasNoCompetitors = (bResult: BenchmarkResultType) => {
    return !bResult.competitors || bResult.competitors.length === 0;
};

export const competitorIsOutPerforming = (competitor: BenchmarkCompetitorType) => {
    return competitor.isOutperforming;
};

export const competitorIsUnderPerforming = (competitor: BenchmarkCompetitorType) => {
    return !competitor.isOutperforming;
};

export const parseBenchmarkValueByUnits = (units = "") => (value: number) => {
    if (units === BenchmarksValuesUnits.PERCENT) {
        return value * 100;
    }

    return value;
};

export const getProspectLabelColor = () => {
    return BENCHMARK_PROSPECT_COLOR;
};

export const getCompetitorsLabelsColors = () => {
    return BENCHMARK_COMPETITORS_COLORS;
};

export const reduceByCompetitorValue = (acc: number[], c: BenchmarkCompetitorType) => {
    return acc.concat(c.value);
};

export const getChartBarsIndicesMapper = (step: number) => (value: number, i: number) => {
    return value + step * i;
};

/**
 * Builds and appends query param string to the given path if value is defined
 * @param name
 * @param value
 */
export const appendAQueryParamIfDefined = (name: string, value?: string | number) => (
    path: string,
) => {
    if (typeof value === "undefined" || value === null) {
        return path;
    }

    const prefix = path.includes("?") ? "&" : "?";

    return path.concat(`${prefix}${name}=${value}`);
};

/**
 * Compares given benchmarks topic and metric
 * @param b1
 * @param b2
 */
export const areBenchmarkResultsMatching = (b1: BenchmarkResultType, b2: BenchmarkResultType) => {
    return b1.benchmark.topic === b2.benchmark.topic && b1.benchmark.metric === b2.benchmark.metric;
};

/**
 * Determines whether given BenchmarkResult is BenchmarkResultGrowth
 */
export const isGrowthBenchmark = (
    bResult: BenchmarkResultType,
): bResult is BenchmarkResultGrowthType => {
    return bResult.benchmark.growthMetric;
};

/**
 * Determines if the prospect has an opportunity to grow
 */
export const isProspectLosingInBenchmark = (aggregatedDetails: AggregatedDetailsType) => {
    return (aggregatedDetails?.opportunity ?? 0) > 0;
};

/**
 * Determines title of opportunity in benchmarks summary
 * @param prospectIsLosing
 */
export function getOpportunityText(prospectIsLosing: boolean): string {
    if (prospectIsLosing) {
        return `${BENCHMARK_ITEM_KEY}.opportunity`;
    }

    return `${BENCHMARK_ITEM_KEY}.gap`;
}

/**
 * Builds unique id for a benchmark item based on its metric and topic
 */
export const getUniqueBenchmarkId = (bResult: BenchmarkResultType) => {
    return `${bResult.benchmark.topic}_${bResult.benchmark.metric}`;
};

/**
 * Mapping helper for objects containing "domain" property
 * @param items
 */
export const mapToDomains = <T extends { domain: string }>(items: T[]) => {
    return items.map((item) => item.domain);
};

/**
 * Returns a height value for a chart based on competitors count
 * @param competitorsCount
 */
export const getChartHeightByCompetitorsCount = (competitorsCount: number) => {
    switch (competitorsCount) {
        case BENCHMARK_COMPETITORS_MAX_COUNT:
            return BENCHMARKS_BAR_CHART_BASE_HEIGHT;
        case BENCHMARK_COMPETITORS_MAX_COUNT - 1:
            return 160;
        case BENCHMARK_COMPETITORS_MAX_COUNT - 2:
            return 120;
        default:
            return BENCHMARKS_BAR_CHART_BASE_HEIGHT;
    }
};

/**
 * Replaces competitor object by given one respecting index
 */
export const replaceCompetitor = <T extends BaseWebsiteType>(
    newCompetitor: Readonly<T>,
    prevDomain: string,
) => (competitors: BaseWebsiteType[]) => {
    const index = competitors.findIndex((c) => c.domain === prevDomain);
    const copy = competitors.slice();
    copy.splice(index, 1, { ...competitors[index], ...newCompetitor });

    return copy;
};

/**
 * Extracts unique list of categories from the benchmark results
 */
export const extractBenchmarkCategories = (results: BenchmarkResultType[]): string[] => {
    // TODO: Sorting is not final
    return Array.from(new Set(results.map((bResult) => bResult.benchmark.category)))
        .sort()
        .reverse();
};

/**
 * Checks whether given category matches with given benchmark's category
 */
export const benchmarkResultHasCategory = (category: string) => (bResult: BenchmarkResultType) => {
    return category === bResult.benchmark.category;
};

export const getNumberSuffixNaive = (position: number) => {
    if (position > 3) {
        return "th";
    }

    return ["st", "nd", "rd"][position - 1];
};

export const toBaseWebsite = <T extends BaseWebsiteType>(website: T): BaseWebsiteType => {
    return {
        domain: website.domain,
        favicon: website.favicon,
    };
};

export const withIsProspectProperty = (isProspect: boolean) => <T extends BaseWebsiteType>(
    website: T,
): WebsiteWithIsProspect => {
    return {
        ...website,
        isProspect,
    };
};

/**
 * Combines given prospect and competitors in single list of websites
 * Is sorted by website's value (outperforming first).
 * @param prospect
 * @param competitors
 */
export const combineProspectWithCompetitors = (
    prospect: ProspectType,
    competitors: BenchmarkCompetitorType[],
) => {
    const prospectObject = compose(withIsProspectProperty(true), toBaseWebsite)(prospect);
    const [outPerforming, underPerforming] = competitors.reduce(
        (result, competitor) => {
            const competitorObject = compose(
                withIsProspectProperty(false),
                toBaseWebsite,
            )(competitor);

            if (competitor.isOutperforming) {
                result[0].push(competitorObject);
            } else {
                result[1].push(competitorObject);
            }

            return result;
        },
        [[] as WebsiteWithIsProspect[], [] as WebsiteWithIsProspect[]],
    );

    return outPerforming.concat(prospectObject).concat(underPerforming);
};

export const groupTopicsByPopular = (topics: TopicType[]): GroupedTopics => {
    return topics.reduce<GroupedTopics>(
        (grouped, topic) => {
            if (topic.isPopular) {
                grouped.popular.push(topic);
            } else {
                grouped.other.push(topic);
            }

            return grouped;
        },
        { popular: [], other: [] },
    );
};

export const mapAllowedAndCountryShares = (
    allowedCountries: ICountryObject[],
    countryShares: CountrySharesByCountryId,
    key: string,
) => {
    const mappedCountries = allowedCountries.map(({ id, code, icon, text }) => {
        const prospectCountry = countryShares[id];
        const percent = prospectCountry?.[key] || 0;
        return { id, code, icon, text, percent };
    });
    mappedCountries.sort(compareNumericPropDesc("percent"));
    mappedCountries.forEach((item) => (item.percent = formatAsPercents(item.percent)));

    return mappedCountries;
};

export const makeTitleBtnCountry = (title: string) => (): string => {
    return `${title}`;
};

export const makeTitleValue = (title: string) => (value: string | number): string => {
    return `${title} ${value}`;
};

export const makeValueTitle = (title: string) => (value: string | number): string => {
    return `${value} ${title}`;
};

export const wrapperSubDomainInTag = (domain: string, tag: string): string => {
    return domain
        .split(".")
        .map((subDomain) => `<${tag}>${subDomain}</${tag}>`)
        .join(".");
};

/**
 * Returns format of date
 * @param date
 * @param metric
 * @param prevDate
 */
export const makeDisplayDate = (date: string, metric: string, prevDate?: string) => {
    const endDate = dateTimeService.formatWithMoment(date, "MMM YYYY");

    if (prevDate) {
        const startDate = dateTimeService.formatWithMoment(prevDate, "MMM YYYY");
        return `${endDate} vs ${startDate}`;
    }

    return dateTimeService.formatWithMoment(date, "MMMM YYYY");
};

export const getMaxCountryShare = (
    shareObj: Record<string, { country: number; share: number }>,
) => {
    if (Object.keys(shareObj).length === 1) {
        return Object.values(shareObj)[0];
    }
    if (isNotEmptyObject(shareObj)) {
        const shareObjWithoutWW = { ...shareObj };
        delete shareObjWithoutWW[WORLDWIDE_COUNTRY_ID];
        let maxValueCountryShare: Record<string, any> = { share: 0 };
        for (const key in shareObjWithoutWW) {
            if (shareObjWithoutWW[key].share > maxValueCountryShare.share) {
                maxValueCountryShare = shareObjWithoutWW[key];
            }
        }
        return maxValueCountryShare;
    }
    return {};
};

export const disableOnOpportunityChange = (
    similarSites: Record<string, any>[],
    opportunityMode: OpportunityMode,
    greaterIsBetter: boolean,
    prospectValue: number,
) => {
    const copiedSimilarSites = _.cloneDeep(similarSites);
    let result = [];
    if (opportunityMode === OpportunityMode.Achievement) {
        result = copiedSimilarSites.map((site) => {
            if (site.metricValue > prospectValue) {
                site.disabled = greaterIsBetter;
                return site;
            }
            site.disabled = !greaterIsBetter;
            return site;
        });
        return result.sort((siteA, siteB) => siteA.disabled - siteB.disabled);
    }
    if (opportunityMode === OpportunityMode.Opportunity) {
        result = copiedSimilarSites.map((site) => {
            if (site.metricValue < prospectValue) {
                site.disabled = greaterIsBetter;
                return site;
            }
            site.disabled = !greaterIsBetter;
            return site;
        });
        return result.sort((siteA, siteB) => siteA.disabled - siteB.disabled);
    }
    return copiedSimilarSites.map((site) => {
        site.disabled = false;
        return site;
    });
};
