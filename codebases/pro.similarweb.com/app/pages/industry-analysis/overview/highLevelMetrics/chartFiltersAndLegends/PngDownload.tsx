import { PngDownload as PngDownloadInner } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/PngDownload";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { BasicDurations } from "services/DurationService";

export const PngDownload = () => {
    const {
        selectedMetric,
        params,
        chartRef,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const { getTitle } = selectedMetric;
    const { duration } = params;
    const is28d = duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const metricName = getTitle({ is28d });
    return (
        <PngDownloadInner metricName={metricName} chartRef={chartRef} offset={{ x: 20, y: 50 }} />
    );
};
