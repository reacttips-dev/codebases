import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import * as _ from "lodash";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { IncomingReferralsAdvancedFilterService } from "services/AdvancedFilterService/IncomingReferralsAdvancedFilter";
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
    IncomingReferralsAdvancedFilterService.getAllFilters().forEach((filter, index) => {
        const { name, tooltip, id } = filter;
        const link = getLink([
            "websites-trafficReferrals",
            {
                ...params,
                ...{
                    limits: id,
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
            link,
            alertContent: i18nFilter()(`workspaces.marketing.affiliates.alert.${id}`, {
                totalKeywords: numberFilter()(results[index].totalCount),
                totalGain: minVisitsAbbrFilter()(results[index].totalVisits),
            }),
            tableData: results[index].records.slice(0, 5).map((item) => {
                const { domain, totalShare, siteShare, favicon } = item;
                return {
                    url: link,
                    domain,
                    favicon,
                    volume: totalShare,
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

export const tablesDataFetcher = ({
    params,
    main_website,
    colorsForDomain,
    getLink,
    durationString,
}) => {
    return new Promise((resolve) => {
        fetchService
            .get(`/api/workspaces/marketing/affiliates/trafficShareFilter`, params)
            .then((results) => {
                resolve(
                    tablesDataAdapter({
                        results,
                        main_website,
                        colorsForDomain,
                        params,
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
                    y: segment[domain][date],
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
            2: chartDataAdapterItem(monthly.siteMonthlyVisits.growth, colorsForDomain),
            1: chartDataAdapterItem(dailyAndWeekly.referrals.weekly.growth, colorsForDomain),
            0: chartDataAdapterItem(dailyAndWeekly.referrals.daily.growth, colorsForDomain),
        },
        traffic: {
            2: chartDataAdapterItem(monthly.siteMonthlyVisits.visits, colorsForDomain),
            1: chartDataAdapterItem(dailyAndWeekly.referrals.weekly.visits, colorsForDomain),
            0: chartDataAdapterItem(dailyAndWeekly.referrals.daily.visits, colorsForDomain),
        },
        table: getTableProperties(keys, country, _.get(monthly, `siteEngagementMetrics`, [])),
    };
};

export const chartDataAdapterEmpty = (granularity) => {
    return { growth: { [granularity]: [] }, traffic: { [granularity]: [] }, table: [] };
};
export const chartDataFetcher = ({ params, colorsForDomain, granularity, keys }) => {
    return new Promise((resolve) => {
        Promise.all([
            fetchService.get(`/api/workspaces/marketing/referrals/monthly`, params),
            fetchService.get(`/api/workspaces/marketing/traffic/dailyweekly`, params),
        ])
            .then(([{ siteMonthlyVisits, siteEngagementMetrics }, referrals]: any[]) => {
                resolve(
                    chartDataAdapter(
                        {
                            monthly: { siteMonthlyVisits, siteEngagementMetrics },
                            dailyAndWeekly: referrals,
                        },
                        colorsForDomain,
                        keys,
                        params.country,
                    ),
                );
            })
            .catch((e) => {
                resolve(chartDataAdapterEmpty(granularity));
            });
    });
};
