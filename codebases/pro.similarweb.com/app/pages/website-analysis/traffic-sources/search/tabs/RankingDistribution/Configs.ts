import {
    ETiers,
    FORMAT_VISUAL,
    tiersMeta,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { percentageSignFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import { colorsPalettes } from "@similarweb/styles";
import { getPlotBandRange } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Utilities";
import { rankingsDistributionTooltipFormatterSingle } from "./tooltipFormatterSingle";

const baseConfig = ({ isFiltered = false, categories, duration, tooltipPositioner }) => ({
    chart: {
        type: "column",
        spacingTop: 10,
        plotBackgroundColor: "transparent",
        style: {
            fontFamily: "Roboto",
        },
    },
    xAxis: {
        categories,
        crosshair: false,
        type: "category",
        gridLineWidth: 0,
        gridLineDashStyle: "dash",
        tickLength: 5,
        minPadding: 0,
        maxPadding: 0,
        labels: {
            style: {
                textTransform: "capitalize",
                fontSize: 11,
                color: colorsPalettes.carbon[300],
                fontFamily: "Roboto",
            },
        },
        plotBands: [
            {
                // mark the column that corresponds to the data currently displayed in the table
                color: colorsPalettes.carbon[50],
                ...getPlotBandRange(categories, duration),
            },
        ],
    },
    yAxis: {
        tickInterval: 0.25,
        min: 0,
        max: 1,
        tickAmount: 5,
        gridZIndex: 1,
        stackLabels: {
            enabled: false,
        },
        labels: {
            style: {
                textTransform: "capitalize",
                fontSize: 11,
                color: colorsPalettes.carbon[200],
                fontFamily: "Roboto",
            },
        },
    },
    legend: {
        enabled: false,
    },
    tooltip: {
        outside: true,
        positioner: tooltipPositioner,
        followPointer: false,
        formatter: rankingsDistributionTooltipFormatterSingle(isFiltered),
        useHTML: true,
        shared: true,
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
        backgroundColor: null,
        borderWidth: 0,
        shadow: false,
    },
    plotOptions: {
        column: {
            stacking: "normal",
            dataLabels: {
                enabled: false,
            },
            borderWidth: 1,
        },
        series: {
            pointPadding: 0.07,
            groupPadding: 0.07,
            fillOpacity: 1,
            stacking: "normal",
            animation: false,
            marker: {
                enabled: true,
                symbol: "circle",
            },
            // logic for changing the opacity of all other columns when hovering over a specific column
            // point: {
            //     events: {
            //         mouseOver: function() {
            //             let hoveredPointIndex = this.index;
            //             this.series.chart.series.forEach(function(s) {
            //                 s.data.forEach(function(point) {
            //                     if (point.index !== hoveredPointIndex)
            //                         point.update({
            //                             opacity: 0.2
            //                         })
            //                 })
            //             })
            //         },
            //         mouseOut: function() {
            //             let hoveredPointIndex = this.index;
            //
            //             this.series.data.forEach(function(point) {
            //                 if (point.index !== hoveredPointIndex)
            //                     point.update({
            //                         opacity: 1
            //                     });
            //             });
            //         },
            //     },
            // },
        },
    },
});

function tooltipPositioner(width, height, point) {
    const hoverPoints = this.chart.hoverPoints;
    const lowestPointInColumn = hoverPoints[hoverPoints.length - 1];
    const { bottom, left } = lowestPointInColumn.graphic.element.getBoundingClientRect();
    const tooltipOffset = {
        x: 100,
        y: 8,
    };

    if (point.plotX + width > this.chart.plotWidth) {
        tooltipOffset.x = point.plotX + width - this.chart.plotWidth;
    }

    if (point.plotY + height < this.chart.plotHeight) {
        tooltipOffset.y += point.plotY;
    }

    return {
        x: left - tooltipOffset.x,
        y: bottom + tooltipOffset.y,
    };
}

export const getRankingsDistributionChartConfigSingle = (isFiltered, categories, duration) => {
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(FORMAT_VISUAL);
    const yAxisFormatter = ({ value }) => percentageSignFilter()(value, 0);
    return combineConfigs(
        {
            isFiltered,
            categories,
            duration,
            tooltipPositioner,
            xAxisFormatter,
            yAxisFormatter,
        },
        [noLegendConfig, yAxisLabelsConfig, xAxisLabelsConfig, baseConfig],
    );
};

const baseSeries = [
    {
        id: ETiers.TIER5,
        name: tiersMeta[ETiers.TIER5].text,
        tooltipName: tiersMeta[ETiers.TIER5].tooltipText,
        data: [],
        color: tiersMeta[ETiers.TIER5].color,
        visible: true,
        key: tiersMeta[ETiers.TIER5].id,
        borderColor: tiersMeta[ETiers.TIER5].color,
    },
    {
        id: ETiers.TIER4,
        name: tiersMeta[ETiers.TIER4].text,
        tooltipName: tiersMeta[ETiers.TIER4].tooltipText,
        data: [],
        color: tiersMeta[ETiers.TIER4].color,
        visible: true,
        key: tiersMeta[ETiers.TIER4].id,
        borderColor: tiersMeta[ETiers.TIER4].color,
    },
    {
        id: ETiers.TIER3,
        name: tiersMeta[ETiers.TIER3].text,
        tooltipName: tiersMeta[ETiers.TIER3].tooltipText,
        data: [],
        color: tiersMeta[ETiers.TIER3].color,
        visible: true,
        key: tiersMeta[ETiers.TIER3].id,
        borderColor: tiersMeta[ETiers.TIER3].color,
    },
    {
        id: ETiers.TIER2,
        name: tiersMeta[ETiers.TIER2].text,
        tooltipName: tiersMeta[ETiers.TIER2].tooltipText,
        data: [],
        color: tiersMeta[ETiers.TIER2].color,
        visible: true,
        key: tiersMeta[ETiers.TIER2].id,
        borderColor: tiersMeta[ETiers.TIER2].color,
    },
    {
        id: ETiers.TIER1,
        name: tiersMeta[ETiers.TIER1].text,
        tooltipName: tiersMeta[ETiers.TIER1].tooltipText,
        data: [],
        color: tiersMeta[ETiers.TIER1].color,
        visible: true,
        key: tiersMeta[ETiers.TIER1].id,
        borderColor: tiersMeta[ETiers.TIER1].color,
    },
];

// determines which legends and tiers are displayed in the chart.
// This is necessary because the table filter for the chart will
// remove legends and tiers that are not chosen.
export const initialDisplayedTiers = [
    ETiers.TIER1,
    ETiers.TIER2,
    ETiers.TIER3,
    ETiers.TIER4,
    ETiers.TIER5,
];

export const getBaseSeries = (displayedTiers = initialDisplayedTiers) =>
    baseSeries.filter((s) => displayedTiers.includes(s.id));
