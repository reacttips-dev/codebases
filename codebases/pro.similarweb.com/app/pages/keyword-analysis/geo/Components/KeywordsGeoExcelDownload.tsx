import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import * as queryString from "querystring";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const KeywordsGeoExcelDownload = ({ queryParams }) => {
    const defaultExcelEndPoint = "/widgetApi/KeywordAnalysisOP/KeywordAnalysisByGeo/Excel";
    const getExcel = (prefix) => (apiParams) => prefix + "?" + queryString.stringify(apiParams);
    const getExcelLink = getExcel(defaultExcelEndPoint);
    const excelLink = getExcelLink ? getExcelLink(queryParams) : null;
    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid("keywordAnalysis.geography.download", "submit-ok", {
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
