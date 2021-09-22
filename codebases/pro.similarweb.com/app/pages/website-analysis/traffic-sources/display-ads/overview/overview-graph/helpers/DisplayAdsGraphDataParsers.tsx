import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import {
    addPartialDataZones,
    isPartialDataPoint,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import {
    allChannels,
    legendsAndChannelsObjects,
    timeGranularityObjects,
} from "./DisplayAdsGraphConstants";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

const sortByDateAsc = (array) => {
    return array.sort(({ key }, { keyB }) => dayjs.utc(key).unix() - dayjs.utc(keyB).unix());
};

export const parseSingleModeData = ({
    rawData,
    legendItems,
    rawDataMetricName,
    chartType,
    granularityName,
    lastSupportedDate,
}) => {
    try {
        if (rawData && Object.keys(rawData).length > 0) {
            const rawChartData = rawData[rawDataMetricName].Data.BreakDown;
            if (chartType === chartTypes.AREA) {
                // percentage chart
                return parsePercentageData(
                    rawChartData,
                    legendItems,
                    granularityName,
                    lastSupportedDate,
                    chartType,
                );
            } else if (chartType === chartTypes.LINE) {
                const parsedMetricDataObject = {};
                Object.entries(rawChartData).map(([date, object]) => {
                    Object.entries(object).map(([channel, value]) => {
                        if (channel !== allChannels) {
                            if (!parsedMetricDataObject[channel]) {
                                parsedMetricDataObject[channel] = [];
                            }
                            if (
                                (channel !== "Usd Spend" && value != null) ||
                                (channel === "Usd Spend" && value >= 0)
                            ) {
                                parsedMetricDataObject[channel].push({
                                    Key: date,
                                    Value: value,
                                });
                            }
                        }
                    });
                });
                const singleGraphChartData = legendItems.map((legendItem) => {
                    const key = legendItem.rawName;
                    const itemsData = sortByDateAsc(parsedMetricDataObject[key]).map(
                        (item, index, items) => ({
                            x: dayjs.utc(item.Key).valueOf(),
                            y: item.Value,
                            isPartial: isPartialDataPoint(
                                index,
                                items,
                                item,
                                granularityName,
                                lastSupportedDate,
                            ),
                        }),
                    );
                    return {
                        name: legendItem.name,
                        color: legendItem.color,
                        visible: legendItem.visible,
                        data: itemsData,
                    };
                });
                return addPartialDataZones(singleGraphChartData.map(sortDataPointsByDate), {
                    chartType,
                });
            }
        } else {
            return [];
        }
    } catch (e) {
        swLog.error("Error: cannot execute parseSingleModeData");
        return [];
    }
};

export const parseCompareModeData = ({
    rawData,
    legendItems,
    rawDataMetricName,
    chartType,
    selectedChannel,
    granularityName,
    lastSupportedDate,
}) => {
    try {
        if (rawData && Object.keys(rawData).length > 0) {
            const rawChartData = rawData[rawDataMetricName][selectedChannel].BreakDown;
            if (chartType === chartTypes.AREA) {
                // percentage chart
                return parsePercentageData(
                    rawChartData,
                    legendItems,
                    granularityName,
                    lastSupportedDate,
                    chartType,
                );
            } else if (chartType === chartTypes.LINE) {
                const highchartsObj = {};
                sortByDateAsc(Object.entries(rawChartData)).map(
                    ([date, valuesArr], index, dataItems) => {
                        Object.entries(valuesArr).map(([site, value]) => {
                            if (!highchartsObj[site]) {
                                const siteObj = _.find(
                                    legendItems,
                                    (legend) => legend.name === site,
                                );
                                highchartsObj[site] = {
                                    ...siteObj,
                                    data: [],
                                    y: [],
                                };
                            }
                            const tick = dayjs.utc(date).valueOf();
                            highchartsObj[site].data.push({
                                x: tick,
                                y: value > 0 ? value : null,
                                isPartial: isPartialDataPoint(
                                    index,
                                    dataItems,
                                    { Key: tick },
                                    granularityName,
                                    lastSupportedDate,
                                ),
                            });
                            highchartsObj[site].y.push({
                                channelName: site,
                                Key: date,
                                Value: value > 0 ? value : null,
                            });
                        });
                    },
                );
                return addPartialDataZones(Object.values(highchartsObj).map(sortDataPointsByDate), {
                    chartType,
                });
            }
        }
        return [];
    } catch (e) {
        swLog.error("Error: cannot execute parseCompareModeData");
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

const parsePercentageData = (
    rawChartData,
    legendItems,
    granularityName,
    lastSupportedDate,
    chartType,
) => {
    try {
        const highchartsObj = {};
        const visibleLegendItems = legendItems.filter(({ visible }) => !!visible);
        sortByDateAsc(Object.keys(rawChartData)).map((date, index, dataItems) => {
            const dataObject = Object.fromEntries(
                Object.entries(rawChartData[date]).filter(([key]) => {
                    return !!visibleLegendItems.find(({ rawName }) => rawName === key);
                }),
            );
            const totalDataObj = parseRelativeValuesData(dataObject);
            visibleLegendItems.map((legendItem) => {
                const { rawName } = legendItem;
                if (rawName !== "All Channels") {
                    if (!highchartsObj[rawName]) {
                        highchartsObj[rawName] = {
                            name: legendsAndChannelsObjects?.[rawName]
                                ? i18nFilter()(legendsAndChannelsObjects?.[rawName]?.text)
                                : rawName,
                            data: [],
                            y: [],
                            visible: legendItem.visible,
                            color: legendItem.color,
                        };
                    }
                    const tick = dayjs.utc(date).valueOf();
                    highchartsObj[rawName].data.push({
                        x: tick,
                        y: totalDataObj[rawName] ?? 0,
                        isPartial: isPartialDataPoint(
                            index,
                            dataItems,
                            { Key: tick },
                            granularityName,
                            lastSupportedDate,
                        ),
                    });
                    highchartsObj[rawName].y.push({
                        channelName: rawName,
                        Key: date,
                        Value: totalDataObj[rawName] ?? 0,
                    });
                }
            });
        });

        return addPartialDataZones(Object.values(highchartsObj), { chartType });
    } catch (e) {
        swLog.error("Error: cannot execute parsePercentageData");
        return {};
    }
};

const parseRelativeValuesData = (rawTotalData) => {
    const totalSum = rawTotalData["All Channels"]
        ? rawTotalData["All Channels"]
        : _.sum(Object.values(rawTotalData).map((value) => (value ? value : 0)));
    const mappedObj = _.mapValues(rawTotalData, (value) => (value ? value / totalSum : 0));
    const [[keyOfLast, valueOfLast], ...allOthers] = Object.entries(mappedObj).slice().reverse();
    const sumOfAllOthers = _.sumBy(allOthers, (keyValue) => keyValue[1]);
    return {
        ...mappedObj,
        [keyOfLast]: valueOfLast
            ? sumOfAllOthers + valueOfLast !== 1
                ? 1 - sumOfAllOthers
                : valueOfLast
            : 0,
    };
};

const parseLegendsData = (rawTotalData, chartType) => {
    switch (chartType) {
        case chartTypes.AREA:
            const areaResult = {};
            for (const [key, value] of Object.entries(rawTotalData)) {
                if (key !== "All Channels") {
                    // filter out legends with 'all channels' for area chart
                    areaResult[key] = value;
                }
            }
            return parseRelativeValuesData(areaResult);
        case chartTypes.LINE:
            const lineResult = {};
            for (const [key, value] of Object.entries(rawTotalData)) {
                if (value > 0 && key !== "All Channels") {
                    // filter out legends with values less than 0 AND 'all channels' for line chart
                    lineResult[key] = value;
                }
            }
            return lineResult;
        default:
            return rawTotalData;
    }
};

const parseTotalData = ({ rawData, isSingle, rawDataMetricName, selectedChannel, chartType }) => {
    const total = isSingle
        ? rawData[rawDataMetricName]?.Data?.Total
        : rawData[rawDataMetricName][selectedChannel]?.Total;
    return parseLegendsData(total, chartType);
};

////////////   Legends initializations //////////

export const initLegendItems = ({
    rawData,
    isSingle,
    selectedChannel,
    chosenSites,
    rawDataMetricName,
    legendsLabelsFormatter,
    chartType,
    getSiteColor,
    unselectedLegends,
}) => {
    const legendsProps = {
        rawData,
        isSingle,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        chartType,
        getSiteColor,
    };
    const rawItems =
        rawData && !_.isEmpty(rawData)
            ? isSingle
                ? initChannelSourcesAsLegends(legendsProps)
                : initComparedSitesAsLegends(legendsProps)
            : [];
    const finalRawItems = rawItems.map((item) => {
        return { ...item, visible: unselectedLegends.indexOf(item.rawName) === -1 };
    });
    return finalRawItems;
};

const initComparedSitesAsLegends = ({
    rawData,
    isSingle,
    rawDataMetricName,
    selectedChannel,
    chartType,
    chosenSites,
    legendsLabelsFormatter,
    getSiteColor,
}) => {
    try {
        const rawTotalData = parseTotalData({
            rawData,
            isSingle,
            rawDataMetricName,
            selectedChannel,
            chartType,
        });
        const legendsData = parseLegendsData(rawTotalData, chartType);
        const getWinner = () => {
            if (Object.keys(legendsData).length > 0) {
                if (rawDataMetricName === "BounceRate") {
                    return _.minBy(Object.keys(legendsData), (o) => {
                        return legendsData[o];
                    });
                } else {
                    return _.maxBy(Object.keys(legendsData), (o) => {
                        return legendsData[o];
                    });
                }
            } else {
                return "";
            }
        };
        const comparedSitesLegendsArr = chosenSites.reduce((acc, site) => {
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
                visible: currentLegendValue !== "N/A",
                isDisabled: currentLegendValue === "N/A",
                data: currentLegendValue,
                get isWinner() {
                    return acc.length > 1 && site === getWinner().toString();
                },
            });
            return acc;
        }, []);
        return comparedSitesLegendsArr;
    } catch (e) {
        swLog.error("Error: cannot execute initComparedSitesAsLegends");
        return [];
    }
};

const initChannelSourcesAsLegends = ({
    rawData,
    isSingle,
    selectedChannel,
    rawDataMetricName,
    legendsLabelsFormatter,
    chartType,
}) => {
    try {
        const rawTotalData = parseTotalData({
            rawData,
            isSingle,
            rawDataMetricName,
            selectedChannel,
            chartType,
        });
        const legendsData = parseLegendsData(rawTotalData, chartType);
        const getWinner = () => {
            if (rawDataMetricName === "BounceRate") {
                return _.minBy(Object.keys(legendsData), (o) => {
                    return legendsData[o];
                });
            } else {
                return _.maxBy(Object.keys(legendsData), (o) => {
                    return legendsData[o];
                });
            }
        };
        const legendItemName = selectedChannel;
        const channelSourcesLegendsArr = [];
        if (Object.keys(rawTotalData).indexOf(legendItemName) > -1) {
            const currentLegendRawValue =
                legendsData[legendItemName] && legendsData[legendItemName] > 0
                    ? legendsData[legendItemName]
                    : 0;
            const currentLegendFormattedValue =
                legendsData[legendItemName] && legendsData[legendItemName] > 0
                    ? legendsLabelsFormatter({
                          value: legendsData[legendItemName],
                      })
                    : "N/A";
            channelSourcesLegendsArr.push({
                rawName: legendItemName,
                name: i18nFilter()(legendsAndChannelsObjects[legendItemName].text),
                visible: true,
                color: legendsAndChannelsObjects[legendItemName].color,
                data: currentLegendFormattedValue,
                rawValue: currentLegendRawValue,
                get isWinner() {
                    return (
                        channelSourcesLegendsArr.length > 1 &&
                        legendItemName === getWinner().toString()
                    );
                },
            });
        }
        return channelSourcesLegendsArr;
    } catch (e) {
        swLog.error("Error: cannot execute initChannelSourcesAsLegends");
        return [];
    }
};

export const getIntervalConfig = (timeGranularity) => {
    if (timeGranularity === timeGranularityObjects.monthly.name) {
        return monthlyIntervalConfig;
    }
    if (timeGranularity === timeGranularityObjects.weekly.name) {
        return weeklyIntervalConfig;
    }
    return dailyIntervalConfig;
};
