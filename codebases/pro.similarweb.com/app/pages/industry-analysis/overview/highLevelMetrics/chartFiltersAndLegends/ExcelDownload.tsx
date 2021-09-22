import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { ExcelDownload as ExcelDownloadInner } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";
import React from "react";
import { DefaultFetchService } from "services/fetchService";

const ENDPOINT = "widgetApi/IndustryAnalysisOverview/EngagementOverview/Excel";

export const ExcelDownload = () => {
    const { queryParams } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const fetcherService = DefaultFetchService.getInstance();
    const excelLink = `${ENDPOINT}?${fetcherService.requestParams(queryParams)}`;
    return <ExcelDownloadInner excelLink={excelLink} />;
};
