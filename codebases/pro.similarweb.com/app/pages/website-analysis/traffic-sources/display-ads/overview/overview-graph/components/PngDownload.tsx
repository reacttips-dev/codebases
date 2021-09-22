import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PdfExportService } from "services/PdfExportService";

export const PngDownload = ({ chartRef, selectedMetricName, offset = { x: 0, y: 0 } }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const getPNG = async () => {
        TrackWithGuidService.trackWithGuid("display_ads.overview.graph.download", "submit-ok", {
            metric: selectedMetricName,
            type: "PNG",
        });

        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        let height = chartRef?.current?.offsetHeight + 30;
        height = isNaN(height) ? 400 : height;
        !isLoading && setIsLoading(true);
        try {
            await PdfExportService.downloadHtmlPngFedService(
                styleHTML + chartRef.current.outerHTML,
                selectedMetricName,
                1366 + offset.x,
                height + offset.y,
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <DownloadButtonMenu
            clientSideDownloadInProgress={isLoading}
            PNG={true}
            exportFunction={getPNG}
        />
    );
};
