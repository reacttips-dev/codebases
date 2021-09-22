import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import * as _ from "lodash";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { DefaultFetchService } from "services/fetchService";
const fetchService = DefaultFetchService.getInstance();

export const tablesDataAdapter = ({
    results,
    main_website,
    colorsForDomain,
    params,
    getLink,
    durationString,
}) => {
    const result = {};
    KeywordAdvancedFilterService.getAllFilters().forEach((filter, index) => {
        const { name, tooltip, id } = filter;
        const linkSeeAll = getLink([
            "competitiveanalysis_website_search_keyword",
            {
                ...params,
                ...{
                    limits: id,
                    selectedTab: "keywords",
                    key: params.sites,
                    isWWW: params.includeSubDomains ? "*" : "-",
                    duration: durationString,
                },
            },
        ]);
        result[id] = {
            id,
            title: i18nFilter()(name),
            tooltip: i18nFilter()(tooltip, { main_website }),
            link: linkSeeAll,
            alertContent: i18nFilter()(`workspaces.marketing.organic.search.overview.alert.${id}`, {
                totalKeywords: numberFilter()(results[index].totalCount),
                totalGain: minVisitsAbbrFilter()(results[index].totalVisits),
            }),
            tableData: results[index].records.slice(0, 5).map((item) => {
                const { searchTerm, kwVolume, siteShare } = item;
                const linkSeeOne = getLink([
                    "keywordAnalysis-overview",
                    {
                        ...params,
                        ...{
                            keyword: searchTerm,
                            isWWW: params.includeSubDomains ? "*" : "-",
                            duration: durationString,
                        },
                    },
                ]);
                return {
                    url: linkSeeOne,
                    keyword: searchTerm,
                    volume: kwVolume,
                    trafficDistribution: Object.keys(siteShare).map((domain) => {
                        return {
                            backgroundColor: colorsForDomain[domain],
                            color: "#FFFFFF",
                            name: domain,
                            text: percentageSignFilter()(siteShare[domain], 2),
                            width: siteShare[domain],
                        };
                    }),
                };
            }),
        };
    });
    return result;
};
export const chartDataAdapterItem = (segment, colorsForDomain) => {
    return Object.keys(segment).map((domain) => {
        return {
            name: domain,
            color: colorsForDomain[domain],
            marker: {
                symbol: "circle",
            },
            data: Object.keys(segment[domain]).map((date, index) => {
                return {
                    x: dateToUTC(date),
                    y: segment[domain][date] === "NaN" ? 0 : segment[domain][date],
                };
            }),
        };
    });
};
export const getTableProperties = (keys, country, segment) => {
    return keys.map((key) => {
        return {
            Domain: key.domain,
            country,
            favicon: key.favicon,
            TrafficShare: parseFloat(_.get(segment, `["${key.domain}"].marketShare`, null)),
            Visits: parseFloat(_.get(segment, `["${key.domain}"].visits`, null)),
            Change: parseFloat(_.get(segment, `["${key.domain}"].visitsChange`, null)),
            ArgVisitDuration: parseFloat(_.get(segment, `["${key.domain}"].averageDuration`, null)),
            BounceRate: parseFloat(_.get(segment, `["${key.domain}"].bounceRate`, null)),
            PagesPerVisit: parseFloat(_.get(segment, `["${key.domain}"].pagesPerVisit`, null)),
        };
    });
};

export const chartDataAdapter = ({ monthly, dailyAndWeekly }, colorsForDomain, keys, country) => {
    return {
        growth: {
            2: {
                // monthly
                branded: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.branded.growth,
                    colorsForDomain,
                ),
                nonBranded: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.nonBranded.growth,
                    colorsForDomain,
                ),
                total: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.total.growth,
                    colorsForDomain,
                ),
            },
            1: {
                // Weekly
                total: chartDataAdapterItem(
                    dailyAndWeekly.organicSearch.weekly.growth,
                    colorsForDomain,
                ),
            },
            0: {
                // Daily
                total: chartDataAdapterItem(
                    dailyAndWeekly.organicSearch.daily.growth,
                    colorsForDomain,
                ),
            },
        },
        traffic: {
            2: {
                // monthly
                branded: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.branded.visits,
                    colorsForDomain,
                ),
                nonBranded: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.nonBranded.visits,
                    colorsForDomain,
                ),
                total: chartDataAdapterItem(
                    monthly.siteMonthlyVisits.total.visits,
                    colorsForDomain,
                ),
            },
            1: {
                // Weekly
                total: chartDataAdapterItem(
                    dailyAndWeekly.organicSearch.weekly.visits,
                    colorsForDomain,
                ),
            },
            0: {
                // Daily
                total: chartDataAdapterItem(
                    dailyAndWeekly.organicSearch.daily.visits,
                    colorsForDomain,
                ),
            },
        },
        table: {
            branded: getTableProperties(
                keys,
                country,
                _.get(monthly, `siteEngagementMetrics.branded`, null),
            ),
            nonBranded: getTableProperties(
                keys,
                country,
                _.get(monthly, `siteEngagementMetrics.nonBranded`, null),
            ),
            total: getTableProperties(
                keys,
                country,
                _.get(monthly, `siteEngagementMetrics.total`, null),
            ),
        },
    };
};
export const chartDataAdapterEmpty = (granularity, currentSelected) => {
    return {
        growth: { [granularity]: { [currentSelected]: [] } },
        traffic: { [granularity]: { [currentSelected]: [] } },
        table: [],
    };
};

const defaultTablesDataParams = {
    IncludeBranded: false,
    IncludeNewKeywords: false,
    IncludeNoneBranded: true,
    IncludeOrganic: true,
    IncludePaid: false,
    IncludeQuestions: false,
    IncludeTrendingKeywords: false,
    timeGranularity: "Monthly",
    pageSize: 2,
};
export const tablesDataFetcher = ({
    params,
    main_website,
    colorsForDomain,
    getLink,
    durationString,
}) => {
    const paramsCombined = {
        ...defaultTablesDataParams,
        ...params,
    };
    return new Promise((resolve) => {
        fetchService
            .get(`/api/workspaces/marketing/keywords/trafficShareFilter`, paramsCombined)
            .then((results) => {
                resolve(
                    tablesDataAdapter({
                        results,
                        main_website,
                        colorsForDomain,
                        params: paramsCombined,
                        getLink,
                        durationString,
                    }),
                );
            })
            .catch((e) => {
                resolve([]);
            });
    });
};
export const chartDataFetcher = ({
    params,
    colorsForDomain,
    granularity,
    selectedDropdownItemId,
    keys,
}) => {
    return new Promise((resolve) => {
        Promise.all([
            fetchService.get(`/api/workspaces/marketing/organic/monthly`, {
                ...params,
                webSource: "Desktop",
            }),
            fetchService.get(`/api/workspaces/marketing/traffic/dailyweekly`, {
                ...params,
                webSource: "Desktop",
            }),
        ])
            .then(([{ siteMonthlyVisits, siteEngagementMetrics }, organicSearch]: any[]) => {
                resolve(
                    chartDataAdapter(
                        {
                            monthly: { siteMonthlyVisits, siteEngagementMetrics },
                            dailyAndWeekly: organicSearch,
                        },
                        colorsForDomain,
                        keys,
                        params.country,
                    ),
                );
            })
            .catch((e) => {
                resolve(chartDataAdapterEmpty(granularity, selectedDropdownItemId));
            });
    });
};
