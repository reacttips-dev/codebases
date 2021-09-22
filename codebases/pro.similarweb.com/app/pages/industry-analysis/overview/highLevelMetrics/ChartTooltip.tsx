import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";
import React from "react";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips/src/ChangeTooltip";
import { BasicDurations } from "services/DurationService";
import { IIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { colorsPalettes } from "@similarweb/styles";
import { getChange } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/CommonChartTooltip";
import { i18nFilter } from "filters/ngFilters";

interface IChartTooltipProps {
    points: any[];
    industryAnalysisOverviewHighLevelMetricsContext: IIndustryAnalysisOverviewHighLevelMetricsContext;
}

export const changeTooltipProp = (formatter) => ({ y, series, point }) => {
    const pointIndex = point.index;
    const previousDataPoint =
        pointIndex === 0 ? series.data[pointIndex].y : series.data[pointIndex - 1].y;
    const change = y / previousDataPoint - 1;
    return {
        value: formatter(y),
        color: series.color,
        displayName: series.name,
        change: previousDataPoint !== 0 && getChange(previousDataPoint, change),
    };
};

export const ChartTooltip: React.FunctionComponent<IChartTooltipProps> = ({
    points: pointsArgs,
    industryAnalysisOverviewHighLevelMetricsContext,
}) => {
    const points = pointsArgs.reverse();
    const {
        selectedMetric,
        timeGranularity,
        params,
        queryParams,
    } = industryAnalysisOverviewHighLevelMetricsContext;
    const { formatter, getTitle, tooltipProps = {} } = selectedMetric;
    const { displayTooltipTotalRow, getChangeColor } = tooltipProps;
    const { duration } = params;
    const { to } = queryParams;
    const is28d = duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const i18n = i18nFilter();
    const changeTooltipProps = {
        header: getTooltipHeader(timeGranularity.value, points, String(to).replace(/\|/g, "/")),
        tableHeaders: [
            { position: 0, displayName: i18n("common.web.source") },
            { position: 1, displayName: getTitle({ is28d }) },
            { position: 2, displayName: i18n("common.tooltip.change") },
        ],
        tableRows: points.map(changeTooltipProp(formatter)),
        showChangeColumn: true,
        getChangeColor,
    };

    if (displayTooltipTotalRow?.(queryParams) && points[0] && points[1]) {
        const totalValue = points[0].y + points[1].y;

        const total = {
            color: colorsPalettes.sky[300],
            value: formatter(totalValue),
            displayName: i18n("common.total"),
            type: "total",
        };
        const totalProps = {
            tableRows: [...changeTooltipProps.tableRows, total],
        };
        const changeTooltipPropsWithTotal = { ...changeTooltipProps, ...totalProps };
        return <ChangeTooltip {...changeTooltipPropsWithTotal} />;
    }

    return <ChangeTooltip {...changeTooltipProps} />;
};
