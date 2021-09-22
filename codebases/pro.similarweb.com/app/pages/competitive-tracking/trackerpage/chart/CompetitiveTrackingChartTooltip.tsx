import { getTooltipHeader } from "UtilitiesAndConstants/UtilitiesComponents/chartTooltipHeaderWithMTDSupport";
import React from "react";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips/src/ChangeTooltip";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import { changeTooltipProp } from "pages/industry-analysis/overview/highLevelMetrics/ChartTooltip";
import { EChartViewType, ICompetitiveTrackerHighLevelMetricsContext } from "../context/types";

interface IChartTooltipProps {
    points: any[];
    competitiveTrackerHighLevelMetricsContext: ICompetitiveTrackerHighLevelMetricsContext;
}

const percentageFilter = (value) => percentageSignFilter()(value, 2);

export const CompetitiveTrackingChartTooltip: React.FC<IChartTooltipProps> = ({
    points: pointsArgs,
    competitiveTrackerHighLevelMetricsContext,
}) => {
    const points = pointsArgs.reverse();
    const {
        selectedMetric,
        timeGranularity,
        chartViewType,
    } = competitiveTrackerHighLevelMetricsContext;
    const { formatter: metricFormatter, title, tooltipProps = {} } = selectedMetric;
    const isPercentageView = chartViewType === EChartViewType.PERCENTAGE;
    const formatter = isPercentageView ? percentageFilter : metricFormatter;
    const { getChangeColor } = tooltipProps;
    const i18n = i18nFilter();
    const changeTooltipProps = {
        header: getTooltipHeader(timeGranularity.value, points),
        tableHeaders: [
            { position: 0, displayName: i18n("common.web.source") },
            { position: 1, displayName: title },
            { position: 2, displayName: i18n("common.tooltip.change") },
        ],
        tableRows: points.map(changeTooltipProp(formatter)),
        showChangeColumn: true,
        getChangeColor,
    };

    return <ChangeTooltip {...changeTooltipProps} />;
};
