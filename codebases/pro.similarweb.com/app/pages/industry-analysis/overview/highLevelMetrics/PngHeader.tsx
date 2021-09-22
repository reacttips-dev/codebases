import { PngHeader as PngHeaderView } from "UtilitiesAndConstants/UtilitiesComponents/PngHeader";
import * as React from "react";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import DurationService, { BasicDurations } from "services/DurationService";

export const PngHeader = () => {
    const {
        params,
        selectedMetric,
        durations,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const { country, webSource, duration } = params;
    const is28d = duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const metricTitle = selectedMetric.getTitle({ is28d });
    return (
        <PngHeaderView
            metricTitle={metricTitle}
            durations={durations.forWidget}
            webSource={webSource}
            country={country}
        />
    );
};
