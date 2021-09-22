import React from "react";
import * as queryString from "querystring";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const ExcelDownload = ({ queryParams, selectedMetricName }) => {
    const defaultExcelEndPoint = "/widgetApi/WebsiteDisplayAds/WebsiteAdsOverTimeOverview/Excel";
    const getExcel = (prefix) => (apiParams) => prefix + "?" + queryString.stringify(apiParams);
    const getExcelLink = getExcel(defaultExcelEndPoint);
    const excelLink = getExcelLink ? getExcelLink(queryParams) : null;
    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid("display_ads.overview.graph.download", "submit-ok", {
            metric: selectedMetricName,
            type: "Excel",
        });
    };

    return (
        <a href={excelLink}>
            <DownloadButtonMenu
                Excel={true}
                downloadUrl={excelLink}
                exportFunction={onExcelClick}
            />
        </a>
    );
};
