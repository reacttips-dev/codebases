import { colorsPalettes } from "@similarweb/styles";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { changeFilter, i18nFilter, minAbbrNumberFilter, percentageFilter } from "filters/ngFilters";
import { percentageSignFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import {
    StackLabel,
    TrafficOverTimeChartToolTip,
    TrafficOverTimeChartToolTipBottom,
    AbsValueWrapper,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { AbsNumsCompareChangeTooltipFormatter } from "pages/website-analysis/incoming-traffic/compare/AbsNumsCompareChangeTooltip";
import { tooltipPositioner } from "services/HighchartsPositioner";

export const getChange = (origNum, newNum) => {
    return origNum ? (newNum - origNum) / origNum : 0;
};

export const CommonChangeOverTimeChartTooltipContent: React.FC<{
    isFirstItem: boolean;
    change: number;
    valueFormatted: string;
    /** whether the tooltip should display "--" when there is no change */
    showNoChangeSymbol?: boolean;
}> = ({ valueFormatted, isFirstItem, change, showNoChangeSymbol = false }) => {
    return (
        <TrafficOverTimeChartToolTipBottom>
            {valueFormatted}
            {!isFirstItem && change !== 0 && (
                <ChangeValue
                    descriptionText={""}
                    value={changeFilter()(Math.abs(change))}
                    isDecrease={change < 0}
                />
            )}
            {change === 0 && showNoChangeSymbol ? <div>--</div> : null}
        </TrafficOverTimeChartToolTipBottom>
    );
};
export function commonOverTimeChartConfigSingleTooltipFormatter(filter) {
    return function () {
        const currentIndex = this.series.xData.findIndex((x) => x === this.key);
        const change = getChange(this.series.yData[currentIndex - 1], this.y);
        const dateForTitle = dayjs.utc(this.x).utc().format("MMM YYYY");
        return ReactDOMServer.renderToString(
            <TrafficOverTimeChartToolTip>
                <strong>Traffic Share - {dateForTitle}</strong>
                <CommonChangeOverTimeChartTooltipContent
                    isFirstItem={currentIndex === 0}
                    change={change}
                    valueFormatted={`${filter[0]()(this.y, 2)}%`}
                />
            </TrafficOverTimeChartToolTip>,
        );
    };
}

export function commonOverTimeChartConfigSingleAbsNumsTooltipFormatter(filter) {
    return function () {
        const currentIndex = this.series.xData.findIndex((x) => x === this.key);
        const prevY = this.series.yData[currentIndex - 1];
        let change: number;
        let changeValue: string | number;

        if (prevY === 0 && this.y !== 0) {
            changeValue = i18nFilter()("common.tooltip.change.new");
        } else {
            change = getChange(prevY, this.y);
            changeValue = change === 0 ? 0 : changeFilter()(Math.abs(change), 0);
        }

        const dateForTitle = dayjs.utc(this.x).utc().format("MMM YYYY");
        return ReactDOMServer.renderToString(
            <TrafficOverTimeChartToolTip>
                <strong>Traffic - {dateForTitle}</strong>
                <TrafficOverTimeChartToolTipBottom>
                    <AbsValueWrapper>{filter[0]()(this.y)}</AbsValueWrapper>
                    {currentIndex !== 0 && change !== 0 && (
                        <ChangeValue
                            descriptionText={""}
                            value={changeValue.toString()}
                            isDecrease={change < 0}
                            unsigned={prevY === 0 && this.y !== 0}
                        />
                    )}
                </TrafficOverTimeChartToolTipBottom>
            </TrafficOverTimeChartToolTip>,
        );
    };
}
export const commonOverTimeChartConfigSingle = ({ type }) => ({
    chart: {
        height: null,
        type,
        spacingTop: 10,
        plotBackgroundColor: "transparent",
        events: {},
        style: {
            fontFamily: "Roboto",
        },
    },
    plotOptions: {
        line: {
            lineColor: colorsPalettes.blue[400],
        },
        series: {
            marker: {
                fillColor: colorsPalettes.blue[400],
            },
        },
    },
    xAxis: {
        labels: {
            style: {
                color: "#919191",
            },
        },
    },
    yAxis: {
        labels: {
            style: {
                color: "#919191",
            },
        },
    },
    tooltip: {
        followPointer: false,
        shared: false,
        useHTML: true,
        backgroundColor: undefined,
        borderWidth: 0,
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
    },
});
export const getOverTimeChartConfigSingle = (type) => {
    const filter = [percentageFilter];
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(`MMM 'YY`);
    const yAxisFormatter = ({ value }) => `${filter[0]()(value, 2)}%`;
    return combineConfigs(
        {
            type,
            yAxisFormatter,
            xAxisFormatter,
            filter,
            showSeriesBulletColor: false,
        },
        [
            monthlyIntervalConfig,
            xAxisLabelsConfig,
            noLegendConfig,
            yAxisLabelsConfig,
            commonOverTimeChartConfigSingle,
            {
                tooltip: {
                    formatter: commonOverTimeChartConfigSingleTooltipFormatter(filter),
                },
            },
        ],
    );
};
export const getOverTimeChartAbsNumsConfigSingle = (type) => {
    const filter = [minAbbrNumberFilter];
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(`MMM 'YY`);
    const yAxisFormatter = ({ value }) => minAbbrNumberFilter()(value);
    return combineConfigs(
        {
            type,
            yAxisFormatter,
            xAxisFormatter,
            filter,
            showSeriesBulletColor: false,
        },
        [
            monthlyIntervalConfig,
            xAxisLabelsConfig,
            noLegendConfig,
            yAxisLabelsConfig,
            commonOverTimeChartConfigSingle,
            {
                tooltip: {
                    formatter: commonOverTimeChartConfigSingleAbsNumsTooltipFormatter(filter),
                },
            },
        ],
    );
};
export function commonOverTimeChartConfigCompareTooltipFormatter(filter) {
    return function () {
        const dateForTitle = dayjs.utc(this.x).utc().format("MMM YYYY");
        const { points } = this;

        // if the first time period has no data we don't show the change column
        let showChange = false;
        for (let i = 0; i < points.length; i++) {
            if (points[i].series.data[0].originalValue === "NaN") {
                continue;
            } else {
                showChange = true;
            }
        }

        const changeTooltipProp = (points) => {
            const result = points.map((point, index) => {
                const firstPointData = points[index].series.data[0].originalValue;
                const change = getChange(firstPointData, point.point.originalValue);
                return {
                    value: `${filter[0]()(point.point.originalValue, 2)}`,
                    color: point.series.color,
                    displayName: point.series.name,
                    change: change !== 0 && percentageSignFilter()(change, 0),
                };
            });
            return result;
        };

        const changeTooltipProps = {
            header: dateForTitle,
            tableHeaders: [
                { position: 1, displayName: " Share" },
                { position: 0, displayName: "Domain" },
                { position: 2, displayName: "Change" },
            ],
            tableRows: changeTooltipProp(points),
            showChangeColumn: showChange,
        };

        return ReactDOMServer.renderToString(
            <TrafficOverTimeChartToolTip>
                <ChangeTooltip {...changeTooltipProps} />
            </TrafficOverTimeChartToolTip>,
        );
    };
}
export const commonOverTimeChartConfigCompare = ({ colors, filter, categories }) => ({
    colors,
    chart: {
        type: "column",
        style: {
            fontFamily: "Roboto",
        },
    },
    tooltip: {
        followPointer: false,
        shared: true,
        useHTML: true,
        backgroundColor: undefined,
        borderWidth: 0,
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
        positioner: tooltipPositioner,
    },
    yAxis: {
        stackLabels: {
            y: -10,
            enabled: true,
            useHTML: true,
            formatter() {
                const { total } = this;
                return ReactDOMServer.renderToString(<StackLabel>{filter[0]()(total)}</StackLabel>);
            },
        },
        labels: {
            style: {
                color: "#919191",
            },
        },
    },
    xAxis: {
        crosshair: true,
        type: "category",
        categories,
        labels: {
            style: {
                color: "#919191",
            },
        },
    },
    plotOptions: {
        column: {
            stacking: "normal",
            pointWidth: 45,
        },
        series: {
            borderColor: null,
            states: {
                hover: {
                    enabled: false,
                },
            },
        },
    },
});
export const getOverTimeChartConfigCompare = ({ type, categories, colors }) => {
    const filter = [percentageSignFilter];
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(`MMM 'YY`);
    const yAxisFormatter = ({ value }) => `${filter[0]()(value, 2)}`;
    return combineConfigs(
        {
            type,
            filter,
            xAxisFormatter,
            yAxisFormatter,
            categories,
            colors,
        },
        [
            noLegendConfig,
            yAxisLabelsConfig,
            xAxisLabelsConfig,
            commonOverTimeChartConfigCompare,
            {
                tooltip: {
                    formatter: commonOverTimeChartConfigCompareTooltipFormatter(filter),
                },
            },
        ],
    );
};
export const getOverTimeChartAbsNumsConfigCompare = ({ type, categories, colors }) => {
    const filter = [minAbbrNumberFilter];
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(`MMM 'YY`);
    const yAxisFormatter = ({ value }) => minAbbrNumberFilter()(value);
    return combineConfigs(
        {
            type,
            filter,
            xAxisFormatter,
            yAxisFormatter,
            categories,
            colors,
        },
        [
            noLegendConfig,
            yAxisLabelsConfig,
            xAxisLabelsConfig,
            commonOverTimeChartConfigCompare,
            {
                tooltip: {
                    formatter: function () {
                        return AbsNumsCompareChangeTooltipFormatter({ points: this.points });
                    },
                },
            },
        ],
    );
};
