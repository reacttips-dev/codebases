import React from "react";
import I18n from "../Filters/I18n";

const DownloadPdfOverlay = ({ children = null, isDownloading, className = "" }) => {
    if (!isDownloading) {
        return children;
    } else {
        return (
            <div className={`dashboard-loader-container active ${className}`}>
                <div className="loader-content">
                    <div className="pdf-jumping" />
                    <div className="loader-text-title">
                        <I18n>{"common.pdfoverlay.generatingreport"}</I18n>
                    </div>
                    <div className="loader-text">
                        <I18n>{"common.pdfoverlay.downloadedshortly"}</I18n>
                    </div>
                </div>
            </div>
        );
    }
};
export default DownloadPdfOverlay;
