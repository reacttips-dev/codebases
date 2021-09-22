import swLog from "@similarweb/sw-log";
import dayjs from "dayjs";
import _ from "lodash";
import { addPartialDataZones } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";

export const parseSingleModeData = ({
    rawData,
    legendItems,
    rawDataMetricName,
    chartType,
    selectedChannel,
}) => {
    try {
        if (rawData && Object.keys(rawData).length > 0 && legendItems?.length) {
            const rawChartData = rawData[rawDataMetricName].Data.BreakDown;
            // line chart
            const legend = legendItems[0]; // only one for now
            const parsedMetricDataObject = {};
            Object.entries(rawChartData).map(([date, object]) => {
                Object.entries(object).map(([channel, value]) => {
                    if (!parsedMetricDataObject[channel]) {
                        parsedMetricDataObject[channel] = [];
                    }
                    if (value >= 0) {
                        parsedMetricDataObject[channel].push({
                            Key: date,
                            Value: value,
                        });
                    }
                });
            });
            const key = parsedMetricDataObject[selectedChannel] ? selectedChannel : null;
            const itemsData = key
                ? parsedMetricDataObject[key].map((item) => ({
                      x: dayjs.utc(item.Key).valueOf(),
                      y: item.Value !== null && item.Value >= 0 ? item.Value : null,
                  }))
                : [];
            const singleGraphChartData = [
                {
                    name: legend.name,
                    data: itemsData,
                    color: legend.color,
                    visible: legend.visible,
                },
            ];
            return addPartialDataZones(singleGraphChartData.map(sortDataPointsByDate), {
                chartType,
            });
        } else {
            return [];
        }
    } catch (e) {
        swLog.warn("Error: cannot execute parseSingleModeData");
        return [];
    }
};

export const parseCompareModeData = ({
    rawData,
    legendItems,
    rawDataMetricName,
    chartType,
    selectedChannel,
}) => {
    try {
        if (rawData && Object.keys(rawData).length > 0) {
            const rawChartData = rawData[rawDataMetricName][selectedChannel].BreakDown;
            // line chart
            const highchartsObj = {};
            Object.entries(rawChartData).map(([date, valuesArr]) => {
                Object.entries(valuesArr).map(([site, value]) => {
                    if (!highchartsObj[site]) {
                        const siteObj = _.find(legendItems, (legend) => legend.name === site);
                        highchartsObj[site] = {
                            ...siteObj,
                            data: [],
                            y: [],
                        };
                    }
                    const tick = dayjs.utc(date).valueOf();
                    highchartsObj[site].data.push({
                        x: tick,
                        y: value !== null && value >= 0 ? value : null,
                    });
                    highchartsObj[site].y.push({
                        channelName: site,
                        Key: date,
                        Value: value !== null && value >= 0 ? value : null,
                    });
                });
            });
            return addPartialDataZones(Object.values(highchartsObj).map(sortDataPointsByDate), {
                chartType,
            });
        }
        return [];
    } catch (e) {
        swLog.warn("Error: cannot execute parseCompareModeData");
        return [];
    }
};

const sortDataPointsByDate = (config) => {
    const data = config?.data ?? [];
    return {
        ...config,
        data: data.slice().sort((item1, item2) => {
            let d1: number;
            let d2: number;
            if (Array.isArray(item1)) {
                [[d1], [d2]] = [item1, item2];
            } else {
                [{ x: d1 }, { x: d2 }] = [item1, item2];
            }
            if (isNaN(d1) || isNaN(d2)) {
                return 0;
            }
            return d1 - d2;
        }),
    };
};

const parseLegendsData = (rawTotalData) => {
    const lineResult = {};
    for (const [key, value] of Object.entries(rawTotalData)) {
        if (value > 0) {
            // filter out legends with values less than 0 for line chart
            lineResult[key] = value;
        }
    }
    return lineResult;
};

const parseTotalData = ({ rawData, isSingleMode, rawDataMetricName, selectedChannel }) => {
    const total = isSingleMode
        ? rawData[rawDataMetricName]?.Data?.Total
        : rawData[rawDataMetricName][selectedChannel]?.Total;
    return parseLegendsData(total);
};

////////////   Legends initializations //////////

export const initComparedSitesAsLegends = ({
    rawData,
    isSingleMode,
    selectedChannel,
    chosenSites,
    rawDataMetricName,
    legendsLabelsFormatter,
    getSiteColor,
}) => {
    try {
        const disabled = Object.keys(rawData?.["Ad Spend"]?.["Paid Visits"]?.Total ?? {}).filter(
            (site) => rawData?.["Ad Spend"]?.["Paid Visits"]?.Total?.[site] < 5000,
        );
        const legendsData = parseTotalData({
            rawData,
            isSingleMode,
            rawDataMetricName,
            selectedChannel,
        });
        const getWinner = () => {
            return _.maxBy(Object.keys(legendsData), (o) => {
                return legendsData[o];
            });
        };
        const ComparedSitesLegendsArr = chosenSites.reduce((acc, site) => {
            const currentLegendValue =
                legendsData[site] && legendsData[site] > 0
                    ? legendsLabelsFormatter({
                          value: legendsData[site],
                      })
                    : "N/A";
            acc.push({
                name: site,
                rawName: site,
                color: getSiteColor(site),
                visible: true,
                isDisabled: currentLegendValue === "N/A" || disabled.indexOf(site) > -1,
                data: currentLegendValue,
                get isWinner() {
                    return acc.length > 1 && getWinner() && site === getWinner().toString();
                },
            });
            return acc;
        }, []);
        return ComparedSitesLegendsArr;
    } catch (e) {
        swLog.warn("Error: cannot execute initComparedSitesAsLegends");
        return [];
    }
};

export const initChannelSourcesAsLegends = ({
    rawData,
    isSingleMode,
    selectedChannel,
    chosenSites,
    rawDataMetricName,
    legendsLabelsFormatter,
    getSiteColor,
}) => {
    try {
        const legendsData = parseTotalData({
            rawData,
            isSingleMode,
            rawDataMetricName,
            selectedChannel,
        });
        const legendItemName = selectedChannel;
        const channelSourcesLegendsArr = [];
        const site = chosenSites[0];
        const currentLegendRawValue =
            legendsData[legendItemName] && legendsData[legendItemName] > 0
                ? legendsData[legendItemName]
                : 0;
        const currentLegendValue =
            legendsData[legendItemName] && legendsData[legendItemName] > 0
                ? legendsLabelsFormatter({
                      value: legendsData[legendItemName],
                  })
                : "N/A";
        channelSourcesLegendsArr.push({
            name: site,
            rawName: site,
            color: getSiteColor(site),
            visible: true,
            isDisabled:
                currentLegendValue === "N/A" ||
                !rawData?.["Ad Spend"]?.Data?.Total["Paid Visits"] ||
                rawData?.["Ad Spend"]?.Data?.Total["Paid Visits"] < 5000,
            data: currentLegendValue,
            rawValue: currentLegendRawValue,
        });
        return channelSourcesLegendsArr;
    } catch (e) {
        swLog.warn("Error: cannot execute initChannelSourcesAsLegends");
        return [];
    }
};

////////////   Data Backend Transformation Helper Functions //////////

const fillNoValueInBreakDownInSingleMode = (data) => {
    Object.keys(data?.["Ad Spend"]?.Data?.BreakDown ?? {}).forEach((date) => {
        if (data?.["Ad Spend"]?.Data?.BreakDown?.[date] === null) {
            data["Ad Spend"].Data.BreakDown[date] = {
                ["Usd Spend"]: null,
            };
        }
    });
    return data;
};

const fillNoValueForSitesInBreakDownInCompareMode = (key, data) => {
    const sites = key.split(",");
    Object.keys(data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown ?? {}).forEach((date) => {
        sites.forEach((site) => {
            site = site.trim();
            if (data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown?.[date] === null) {
                data["Ad Spend"]["Usd Spend"].BreakDown[date] = {
                    [site]: null,
                };
            } else if (
                data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown?.[date]?.[site] === null ||
                !(data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown?.[date]?.[site] >= 0)
            ) {
                data["Ad Spend"]["Usd Spend"].BreakDown[date][site] = null;
            }
        });
    });
    return data;
};

const hideGraphDataForLessThan5KInCompareMode = (data) => {
    const hiddenSites = Object.keys(data?.["Ad Spend"]?.["Paid Visits"]?.Total ?? {}).filter(
        (site) => data?.["Ad Spend"]?.["Paid Visits"]?.Total?.[site] < 5000,
    );
    Object.keys(data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown ?? {}).forEach((date) => {
        hiddenSites.forEach((site) => {
            delete data?.["Ad Spend"]?.["Usd Spend"]?.BreakDown?.[date]?.[site];
        });
    });
    return data;
};

export const transformData = ({ isSingle, key, data }) => {
    if (isSingle) {
        return fillNoValueInBreakDownInSingleMode(data);
    }
    data = fillNoValueForSitesInBreakDownInCompareMode(key, data);
    data = hideGraphDataForLessThan5KInCompareMode(data);
    return data;
};
