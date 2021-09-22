import { formatTooltipPointWithConfidence } from "components/Chart/src/data/confidenceProcessor";
import ReactDOMServer from "react-dom/server";
import { colorsSets } from "@similarweb/styles";
import defaultTooltip from "components/Chart/src/configs/tooltip/defaultTooltip";
import { tickIntervals } from "components/widget/widget-types/GraphWidget";
import _ from "lodash";
import dayjs from "dayjs";
import { granularityConfigs } from "pages/website-analysis/website-content/leading-folders/FolderAnalysisDefaults";
import {
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import styled from "styled-components";
import combineConfigs from "../../../../components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../components/Chart/src/configs/legend/noLegendConfig";
import markerWithDashedConfig from "../../../../components/Chart/src/configs/series/markerWithDashedLinePerPointChartConfig";
import xAxisCrosshair from "../../../../components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../../../components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "../../../../components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { ICustomSegmentAvailableMembers, SegmentsUtils } from "services/segments/SegmentsUtils";
import DurationService from "services/DurationService";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import { colorsPalettes, fonts } from "@similarweb/styles";

export const TooltipWrapper = styled.div`
    padding: 10px 15px 5px;
    border-radius: 5px;
`;

export const SegmentTypeBadge = styled.span`
    display: inline;
    width: 38px;
    padding: 4px 7px 4px;
    margin-left: 11px;
    color: ${colorsPalettes.carbon[500]};
    background: ${colorsPalettes.carbon[50]};
    border-radius: 8px;
    font-size: 9px;
    line-height: 8px;
    text-transform: uppercase;
    font-family: ${fonts.$robotoFontFamily};
`;

export const SegmentSubtitle = styled.span`
    font-size: 12px;
    color: ${colorsPalettes.carbon[300]};
    vertical-align: middle;
    margin-left: 11px;
    line-height: 16px;
    font-size: 12px;
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: ${fonts.$robotoFontFamily};
`;

const getChangeTooltip = ({
    filter,
    granularity = "Monthly",
    metric,
    isWindow = false,
    toDateMoment = undefined,
    rowHeight,
    data = undefined,
    showChangeColumn,
}) => {
    return {
        tooltip: {
            shared: true,
            outside: false,
            useHTML: true,
            backgroundColor: "#fff",
            borderWidth: 0,
            formatter() {
                const getTooltipHeader = () => {
                    let date;
                    switch (granularity) {
                        case "Daily":
                            date = dayjs.utc(this.x).format("dddd, MMM DD, YYYY");
                            break;
                        case "Weekly":
                            const to: any = dayjs.utc(_.last(this?.points?.series?.xData));
                            const from: any = dayjs.utc(this.x);
                            const isLast: boolean =
                                _.last(this?.points?.[0]?.series?.xData) === this.x;
                            let toWeek = dayjs.utc(this.x).add(6, "days");
                            // show partial week in case of last point when start of week and end of week aren't in the same month.
                            if (isLast && !isWindow) {
                                if (from.month() !== toWeek.month()) {
                                    toWeek = from.clone().endOf("month").startOf("day").utc();
                                }
                            } else if (isLast && isWindow && toDateMoment) {
                                toWeek = toDateMoment;
                            }
                            date = `From ${dayjs
                                .utc(this.x)
                                .format("MMM DD, YYYY")} to ${toWeek.format("MMM DD, YYYY")}`;
                            break;
                        case "Monthly":
                            date = dayjs.utc(this.x).format("MMM. YYYY");
                            break;
                    }
                    return date;
                };

                const getChange = (previousDataPoint, change) =>
                    previousDataPoint
                        ? change !== 0 && percentageSignFilter()(change, 2)
                        : i18nFilter()("common.tooltip.change.new");

                const changeTooltipProp = () => {
                    return data.map((rowData) => {
                        const pointIndex = rowData.data.findIndex((p) => p.x === this.x);
                        const point = rowData.data[pointIndex];
                        const previousPoint =
                            pointIndex === 0
                                ? rowData.data[pointIndex]
                                : rowData.data[pointIndex - 1];
                        const change = point.y / previousPoint.y - 1;
                        return {
                            displayName: rowData.name,
                            value: formatTooltipPointWithConfidence(
                                point.y,
                                point?.confidence,
                                filter,
                            ),
                            color: rowData.color,
                            subtitle: rowData?.seriesSubtitle,
                            change:
                                point.y &&
                                previousPoint !== point &&
                                getChange(previousPoint.y, change),
                        };
                    });
                };

                const changeTooltipProps = {
                    rowHeight,
                    header: getTooltipHeader(),
                    tableHeaders: [
                        { position: 1, displayName: i18nFilter()(metric.title) },
                        { position: 0, displayName: "Segment" },
                        { position: 2, displayName: "Change" },
                    ],
                    tableRows: changeTooltipProp(),
                    showChangeColumn,
                };

                return ReactDOMServer.renderToString(
                    <TooltipWrapper>
                        <ChangeTooltip {...changeTooltipProps} />
                    </TooltipWrapper>,
                );
            },
        },
    };
};

export const getChartConfig = ({
    type,
    filter,
    data,
    metric,
    timeGranularity = "Monthly",
    isWindow = false,
    toDateMoment = undefined,
    yAxisFilter = undefined,
    durationObject = undefined,
    showChangeColumn = true,
}) => {
    const { from, to } = durationObject.raw;
    const durationInMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    const format = durationInMonths <= 1 && timeGranularity != "Monthly" ? "D MMM." : `MMM'YY`;
    const currentGranularity = granularityConfigs[timeGranularity];
    const yAxisFormatter = ({ value }) =>
        yAxisFilter ? yAxisFilter[0]()(value, yAxisFilter[1]) : filter[0]()(value, filter[1]);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter, granularity: timeGranularity }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        data
            ? getChangeTooltip({
                  filter,
                  metric,
                  granularity: timeGranularity,
                  isWindow: durationObject.forAPI?.isWindow,
                  toDateMoment: to,
                  rowHeight: data?.[0] && "seriesSubtitle" in data[0] ? 34 : 24,
                  data,
                  showChangeColumn,
              })
            : defaultTooltip,
        {
            chart: {
                height: null,
                type,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                zoomType: "",
                events: {},
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: false,
                    animation: false,
                    marker: {
                        enabled: isMarkerEnabled(data),
                    },
                },
                area: {
                    stacking: "normal",
                    marker: {
                        enabled: false,
                    },
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                // ...((yAxisFilter?.[0] ?? filter[0]) === percentageSignFilter
                //     ? { min: 0, max: 1 }
                //     : null),
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                tickInterval: getXAxisTickInterval(durationObject, isWindow, timeGranularity),
                minPadding: 0,
                maxPadding: 0,
            },
        },
    ]);
};

export const dateToUTC = (dateString) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};

export const transformData = (
    data,
    selectedRows,
    rowSelectionProp,
    availableMembers: ICustomSegmentAvailableMembers,
) => {
    return _.map(Object.keys(data), (chartKey: string, index) => {
        const chartData = data[chartKey];
        const [customSegment, customSegmentType] = SegmentsUtils.getSegmentObjectByKey(
            chartKey,
            availableMembers,
        );
        const color = selectedRows
            ? _.result(
                  _.find(
                      selectedRows,
                      (row: any) => String(row[rowSelectionProp]) === String(chartKey),
                  ),
                  "selectionColor",
              )
            : colorsSets.c.toArray()[index];
        const currentRow = selectedRows?.find((row) => row.SegmentId === chartKey);
        const baseSeriesConfig: any = {
            name: chartKey,
            seriesSubtitle: "",
            color,
            rowIndex: currentRow.index,
            tooltipIndex: _.findIndex(
                selectedRows,
                (row: any) => String(row[rowSelectionProp]) === String(chartKey),
            ),
        };
        switch (customSegmentType) {
            case SEGMENT_TYPES.SEGMENT:
                if (customSegment) {
                    const customSegmentObj = customSegment as ICustomSegment;
                    baseSeriesConfig.name = customSegmentObj.domain;
                    baseSeriesConfig.seriesSubtitle = (
                        <SegmentSubtitle>{customSegmentObj.segmentName}</SegmentSubtitle>
                    );
                }
                break;
            case SEGMENT_TYPES.WEBSITE:
                if (customSegment) {
                    const customWebsiteObj = customSegment as ICustomSegmentGroupWebsite;
                    baseSeriesConfig.name = customWebsiteObj.domain;
                    baseSeriesConfig.seriesSubtitle = <SegmentTypeBadge>WEBSITE</SegmentTypeBadge>;
                }
                break;
        }
        return combineConfigs(
            {
                ...baseSeriesConfig,
                isDataSingleSeries: true,
                data: _.map(chartData, (dataPoint: any) => {
                    if (!dataPoint) {
                        return;
                    }
                    const datekey = dataPoint.Key;
                    const confidenceLevel = dataPoint.Value?.Confidence;
                    let value = dataPoint.Value?.Value;
                    if (isNaN(parseFloat(value))) {
                        value = null;
                    }

                    return [
                        dateToUTC(datekey),
                        value,
                        {
                            partial: confidenceLevel >= 0.3 && confidenceLevel < 1,
                            hallowMarker: confidenceLevel >= 0.3 && confidenceLevel < 1,
                            confidenceLevel,
                        },
                    ];
                }),
            },
            [baseSeriesConfig, markerWithDashedConfig],
        );
    });
};
export const isMarkerEnabled = (data: any) => {
    return data?.[0]?.data?.length <= 24;
};

export const getXAxisTickInterval = (durationObject, isWindow, timeGranularity) => {
    let ticks;
    const { from, to } = durationObject.raw;
    const durationInMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow);
    if (durationInMonths > 24) {
        //every 2 months
        ticks = tickIntervals.monthly * 2;
    } else if (durationInMonths > 1) {
        ticks = tickIntervals.monthly;
    } else {
        switch (timeGranularity) {
            case "Daily":
            case "Weekly":
                ticks = tickIntervals.daily * 2;
                break;
            case "Monthly":
            default:
                //every other day
                ticks = tickIntervals.monthly;
                break;
        }
    }
    return ticks;
};
