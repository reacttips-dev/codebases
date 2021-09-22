import angular from "angular";
import * as _ from "lodash";

const sortObject = (o, sortfunc?) => {
    if (typeof sortfunc === "function") {
        return Object.keys(o)
            .sort(sortfunc)
            .reduce((r, k) => ((r[k] = o[k]), r), {});
    }
    return Object.keys(o)
        .sort()
        .reduce((r, k) => ((r[k] = o[k]), r), {});
};
/**
 * Created by Eran.Shain on 11/24/2016.
 */
angular.module("websiteAnalysis").factory("channelAnalysisFetcherFactory", ($resource) => {
    const getResource = ({ controller, metric, comparedDuration }) => {
            return $resource(
                "",
                {},
                {
                    channelAnalysis: {
                        url: `/widgetApi/${controller}/${metric}/BarChart`,
                        method: "GET",
                        timeout: 300000,
                        cache: false,
                    },
                },
            ).channelAnalysis;
        },
        granularity = {
            Daily: "DailyData",
            Weekly: "WeeklyData",
            Monthly: "MonthlyData",
        },
        resolvedMetrics = {
            MmxTrafficShare: "TrafficShare",
            MmxAvgVisitDuration: "AverageDuration",
            MmxPagesPerVisit: "PagesPerVisit",
            MmxBounceRate: "BounceRate",
        },
        normalizeData = (obj) =>
            (_.chain(obj)
                .keys()
                .sortBy((channelName) => {
                    switch (channelName) {
                        case "Direct":
                            return 0;
                        case "Email":
                            return 1;
                        case "Referrals":
                            return 2;
                        case "Social":
                            return 3;
                        case "Organic Search":
                            return 4;
                        case "Paid Search":
                            return 5;
                        case "Paid Referrals":
                            return 6;
                        case "Search":
                            return 7;
                    }
                }) as any)
                .reduce((targetObject, channelName) => {
                    targetObject[channelName] = obj[channelName];
                    return targetObject;
                }, {})
                .mapKeys((val, key) => {
                    switch (key) {
                        case "Paid Referrals":
                            return "Display Ads";
                        case "MobileWeb":
                            return "Mobile Web";
                        default:
                            return key;
                    }
                })
                .value();
    return class channelAnalysisDataFetcher {
        private pageState: any;
        private resource: any;
        private backingPromise: any;
        private widgets = [];

        constructor(
            state,
            private settings: any = {
                resolveMetricNames: true,
            },
        ) {
            this.pageState = state;
            this.create = this.create.bind(this);
            this.resource = getResource(state);
            this.backingPromise = null;
        }

        private getBackingPromise(widget) {
            const { isCompare, comparedDuration } = this.pageState;
            const { metric, ...rest } = widget._params;
            const keysArr = widget._params.keys.split(",");
            return this.resource(angular.merge({}, rest)).$promise.then((response) => {
                if (comparedDuration) {
                    // this is an interceptor to build the channels list in compared mode
                    const allChannels =
                        response.Data &&
                        _.reduce(
                            response.Data,
                            (channels, metric: any) => {
                                const brDown = metric.Data.BreakDown;
                                /**
                                 * we have data in format:
                                 * { Data: { AvgDuration: { Data: { BreakDown: { [date]: { [metric(Social)]: value }  } } } ... }}
                                 * we gather object after this:
                                 * { Social: value, ... }
                                 */
                                return brDown
                                    ? {
                                          ...channels,
                                          ..._.head(
                                              _.values(_.pick(brDown, _.head(Object.keys(brDown)))),
                                          ),
                                      }
                                    : channels;
                            },
                            {},
                        );

                    allChannels &&
                        (this.pageState.allChannels = Object.keys(normalizeData(allChannels)).map(
                            (ch) => ({
                                id: ch,
                                text: ch,
                            }),
                        ));
                }
                if (isCompare) {
                    // this is an interceptor to build the channels list in compare mode
                    let allChannels = _.reduce(
                        response.Data,
                        (allChannels, metricObject, metricName) => {
                            Object.values(metricObject).forEach((item) => {
                                item["Total"] = sortObject(
                                    item["Total"],
                                    (a, b) =>
                                        keysArr.findIndex((item) => item === a) -
                                        keysArr.findIndex((item) => item === b),
                                );
                            });
                            return Object.assign(allChannels, metricObject);
                        },
                        {},
                    );
                    this.pageState.allChannels = Object.keys(normalizeData(allChannels)).map(
                        (channel) => ({
                            id: channel,
                            text: channel,
                        }),
                    );
                }
                this.pageState.availableGranularities = ["Monthly"];

                if (!comparedDuration) {
                    response[granularity.Daily] != null
                        ? this.pageState.availableGranularities.push("Daily")
                        : undefined;
                    response[granularity.Weekly] != null
                        ? this.pageState.availableGranularities.push("Weekly")
                        : undefined;
                }

                return response;
            });
        }

        create(widget) {
            const { isCompare, comparedDuration, timeGranularity } = this.pageState;
            const { webSource } = widget.apiParams;

            this.widgets.push(widget);
            this.backingPromise = this.backingPromise || this.getBackingPromise(widget);

            let widgetMetric = widget._params.metric;

            if (this.settings.resolveMetricNames) {
                widgetMetric = resolvedMetrics[widgetMetric];
            }

            return {
                fetch: () => {
                    const widgetDataPromise = this.backingPromise.then((response) => {
                        const granu = granularity[timeGranularity];
                        const data =
                            webSource === "MobileWeb"
                                ? response.Data
                                : timeGranularity
                                ? response[granu]
                                : response.Data;
                        const comparedData =
                            webSource === "MobileWeb" && response.ComparedData
                                ? response.ComparedData.Data
                                : comparedDuration
                                ? response.ComparedData[granu]
                                : response.ComparedData;
                        data[widgetMetric] &&
                            data[widgetMetric].Data &&
                            (data[widgetMetric].Data.comparedData =
                                comparedDuration && comparedData[widgetMetric]);
                        return data[widgetMetric];
                    });
                    return widgetDataPromise.then((response): any => {
                        if (isCompare) {
                            return {
                                Data: normalizeData(response)[this.pageState.selectedChannel],
                            };
                        }

                        if (comparedDuration) {
                            return response;
                        }

                        return _.mapValues(response, (totalAndBreakDown, data) => {
                            return _.mapValues(
                                totalAndBreakDown,
                                (dataObject, totalOrBreakdown) => {
                                    switch (totalOrBreakdown) {
                                        case "Total":
                                            return normalizeData(dataObject);
                                        case "BreakDown":
                                            return _.mapValues(dataObject, (channels) => {
                                                return normalizeData(channels);
                                            });
                                    }
                                },
                            );
                        });
                    });
                },
            };
        }
    };
});
