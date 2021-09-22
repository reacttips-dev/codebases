import React from "react";
import * as queryString from "querystring";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const ExcelDownload = ({ queryParams, metricName }) => {
    const defaultExcelEndPoint = "widgetApi/AdSpend/AdSpend/excel";
    const getExcel = (prefix) => (apiParams) => prefix + "?" + queryString.stringify(apiParams);
    const getExcelLink = getExcel(defaultExcelEndPoint);
    const excelLink = getExcelLink ? getExcelLink(queryParams) : null;
    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.adspend.download",
            "submit-ok",
            { metric: metricName, type: "Excel" },
        );
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
