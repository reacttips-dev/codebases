import { normalizeChartXData } from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartDataProcessor";
import dayjs from "dayjs";
import {
    addPartialDataZones,
    isPartialDataPoint,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";

export const parseData = ({
    isSingleMode,
    sites,
    chosenSite,
    data,
    timeGranularity,
    lastSupportedDate,
    chartType,
}) =>
    isSingleMode
        ? parseSingleModeData({
              sites,
              metricData: data.Data,
              chosenSite,
              timeGranularity,
              lastSupportedDate,
              chartType,
          })
        : parseCompareModeData({
              sites,
              metricData: data.Data,
              timeGranularity,
              lastSupportedDate,
              chartType,
          });

export const parseCompareModeData = ({
    sites,
    metricData,
    timeGranularity,
    lastSupportedDate,
    chartType,
}) =>
    addPartialDataZones(
        sites.map((site) => ({
            name: site.name,
            color: site.color,
            isSelected: site.isSelected,
            data: Object.values(metricData[site.name] || metricData[site.alias])[0][0].map(
                (item, idx, arr) => ({
                    x: dayjs.utc(item.Key).valueOf(),
                    y: item.Value,
                    isPartial: isPartialDataPoint(
                        idx,
                        arr,
                        item,
                        timeGranularity.name,
                        lastSupportedDate,
                    ),
                }),
            ),
            stack: site.name,
        })),
        { chartType },
    );

export const parseSingleModeData = ({
    sites,
    metricData,
    chosenSite,
    timeGranularity,
    lastSupportedDate,
    chartType,
}) =>
    addPartialDataZones(
        sites.map((site) => {
            const key = metricData[chosenSite][site.name] ? site.name : site.alias;
            const itemsData = Array.isArray(metricData[chosenSite][key])
                ? metricData[chosenSite][key][0]
                : metricData[chosenSite][key];
            return {
                name: site.name,
                color: site.color,
                isSelected: site.isSelected,
                data: itemsData.map((item, idx, arr) => ({
                    x: dayjs.utc(item.Key).valueOf(),
                    y: item.Value,
                    isPartial: isPartialDataPoint(
                        idx,
                        arr,
                        item,
                        timeGranularity.name,
                        lastSupportedDate,
                    ),
                })),
                stack: chosenSite,
            };
        }),
        { chartType },
    );

export const parseDedupCompareModeData = ({ sites, metricData }) =>
    sites.map((site) => ({
        name: site.name,
        color: site.color,
        isSelected: site.isSelected,
        metricData: metricData[site.name] || metricData[site.alias],
        data: (metricData[site.name] || metricData[site.alias]).Total[0].map((item) => ({
            x: dayjs.utc(item.Key).valueOf(),
            y: item.Value,
        })),
        stack: site.name,
    }));

export const parsePOPCompareModeDataWithMTD = ({
    sites,
    data,
    metric,
    timeGranularity,
    lastSupportedDate,
    chartType,
}) => {
    const metricData = data?.Data[metric.popApiResponseName];
    return addPartialDataZones(
        sites.map((site) => ({
            name: site.name,
            color: site.color,
            isSelected: site.isSelected,
            data: (metricData[site.name] || metricData[site.alias]).map((item, idx, arr) => ({
                x: dayjs.utc(item.Values[0].Key).valueOf(),
                y: item.Change[0],
                isPartial: isPartialDataPoint(
                    idx,
                    arr,
                    item,
                    timeGranularity.name,
                    lastSupportedDate,
                ),
                comparedDate: dayjs.utc(item.Values[1].Key).valueOf(),
                values: item.Values,
            })),
        })),
        { chartType: chartType },
    );
};

export const parsePOPSingleModeData = (props) => {
    if (props.chartType === "column" && props.webSource === "Total") {
        return addPartialDataZones(parsePOPSingleModeDataCombined({ ...props }), {
            chartType: props.chartType,
        });
    }
    return parsePOPSingleModeDataWithMTD({ ...props });
};

export const parsePOPSingleModeDataWithMTD = ({
    data,
    chosenSite,
    sites,
    timeGranularity,
    lastSupportedDate,
    chartType,
}) => {
    const metricData = Object.values(data.Data[chosenSite])[0] as Array<{
        Values: Array<{ Value: string; Key: string }>;
    }>;
    return addPartialDataZones(
        [
            {
                name: sites[1].name,
                isSelected: sites[1].isSelected,
                color: sites[1].color,
                data: metricData.map((item, idx, arr) => ({
                    x: dayjs.utc(item.Values[0].Key).valueOf(),
                    y: item.Values[0].Value,
                    comparedDate: dayjs.utc(item.Values[1].Key).valueOf(),
                    isPartial: isPartialDataPoint(
                        idx,
                        arr,
                        item,
                        timeGranularity.name,
                        lastSupportedDate,
                    ),
                    values: item.Values,
                })),
            },
            {
                name: sites[0].name,
                isSelected: sites[0].isSelected,
                color: sites[0].color,
                data: metricData.map((item) => ({
                    x: dayjs.utc(item.Values[0].Key).valueOf(),
                    y: item.Values[1].Value,
                    comparedDate: dayjs.utc(item.Values[1].Key).valueOf(),
                    values: item.Values,
                })),
            },
        ],
        { chartType: chartType },
    );
};

const parsePOPSingleModeDataCombined = ({
    data,
    chosenSite,
    sites,
    timeGranularity,
    lastSupportedDate,
}) => {
    const desktopSeries = data.Data[chosenSite]["Desktop"];
    const mobileSeries = data.Data[chosenSite]["Mobile Web"];
    if (!mobileSeries || !desktopSeries) {
        return [];
    }
    return [
        {
            name: "b",
            color: sites[1].color,
            stack: 1,
            isSelected: true,
            data: desktopSeries.map((item, idx, arr) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[0].Value,
                isPartial: isPartialDataPoint(
                    idx,
                    arr,
                    item,
                    timeGranularity.name,
                    lastSupportedDate,
                ),
                change: item.Change,
                values: item.Values,
            })),
        },
        {
            name: "b",
            color: sites[0].color,
            stack: 0,
            isSelected: true,
            data: desktopSeries.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[1].Value,
                change: item.Change,
                originalX: normalizeChartXData(item.Values[1].Key),
                values: item.Values,
            })),
        },
        {
            name: "a",
            color: sites[1].transparentColor,
            stack: 1,
            isSelected: true,
            data: mobileSeries.map((item, idx, arr) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[0].Value,
                isPartial: isPartialDataPoint(
                    idx,
                    arr,
                    item,
                    timeGranularity.name,
                    lastSupportedDate,
                ),
                change: item.Change,
                values: item.Values,
            })),
        },
        {
            name: "a",
            color: sites[0].transparentColor,
            stack: 0,
            isSelected: true,
            data: mobileSeries.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[1].Value,
                change: item.Change,
                values: item.Values,
            })),
        },
    ];
};
