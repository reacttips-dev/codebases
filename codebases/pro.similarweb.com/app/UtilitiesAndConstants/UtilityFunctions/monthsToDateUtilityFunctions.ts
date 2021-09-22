import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { rgba } from "@similarweb/styles";
import { granularityNameToMomentUnit } from "UtilitiesAndConstants/Constants/Moment";

const MONTH_TO_DATE_ENDPOINT_VALUE = { latest: "l" };

export const getMonthsToDateTooltipText = (isMonthToDateAvailable, isMonthToDateActive) => {
    const i18n = i18nFilter();
    return isMonthToDateAvailable
        ? isMonthToDateActive
            ? i18n("wa.traffic.engagement.over.time.mtd.tooltip", {
                  date: swSettings.current.lastSupportedDailyDate.format("MMM DD"),
              })
            : i18n("wa.traffic.engagement.over.time.mtd.tooltip.inactive")
        : i18n("wa.traffic.engagement.over.time.mtd.tooltip.unavailable");
};

const makeZone = (point, { isPartial, chartType, site }) => {
    let zoneStyle;
    if (isPartial) {
        switch (chartType) {
            case chartTypes.AREA:
                zoneStyle = {
                    dashStyle: "solid",
                    fillColor: {
                        pattern: {
                            path: {
                                d: "M 0 0 L 17 17 M -3 14 L 3 20 M 14 -3 L 20 3",
                                strokeWidth: 6,
                                stroke: site.color,
                            },
                            width: 17,
                            height: 17,
                            backgroundColor: rgba(site.color, 0.9),
                        },
                    },
                };
                break;
            case chartTypes.COLUMN:
                zoneStyle = {
                    dashStyle: "solid",
                    color: {
                        pattern: {
                            path: {
                                d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
                                fill: site.color,
                                strokeWidth: 3.5,
                                stroke: site.color,
                            },
                            width: 10,
                            height: 10,
                            backgroundColor: rgba(site.color, 0.9),
                        },
                    },
                };
                break;
            case chartTypes.LINE:
            default:
                zoneStyle = {
                    dashStyle: "dash",
                };
        }
    } else {
        zoneStyle = {
            dashStyle: "solid",
        };
    }
    return {
        value: point?.x,
        ...zoneStyle,
    };
};

export const isPartialDataPoint = (idx, arr, item, timeGranularityName, lastSupportedDate) =>
    idx === arr.length - 1 &&
    dayjs
        .utc(item.Key || (item.Values && item.Values[0]?.Key))
        .add(1, granularityNameToMomentUnit[timeGranularityName])
        .subtract(1, "days")
        .isAfter(dayjs.utc(lastSupportedDate));

export const addPartialDataZones = (graphData, { chartType }) =>
    graphData.map((site) => ({
        ...site,
        zoneAxis: "x",
        zones: site.data.reduce((acc, point, idx) => {
            const nextPoint = site.data[idx + 1];
            const isPartial = point?.isPartial ?? false;
            const nextIsPartial = nextPoint?.isPartial ?? false;
            if (!nextPoint || isPartial !== nextIsPartial) {
                const zonePoint = nextPoint
                    ? [chartTypes.LINE, chartTypes.AREA].includes(chartType)
                        ? point
                        : nextPoint
                    : undefined;
                acc.push(makeZone(zonePoint, { chartType, site, isPartial: isPartial }));
            }
            return acc;
        }, []),
    }));

export const getMonthToDateEndPointValue = () => MONTH_TO_DATE_ENDPOINT_VALUE;

export const monthToDateTracking = (guid) => (monthToDateValue) =>
    TrackWithGuidService.trackWithGuid(guid, "switch", { state: monthToDateValue ? "on" : "off" });
