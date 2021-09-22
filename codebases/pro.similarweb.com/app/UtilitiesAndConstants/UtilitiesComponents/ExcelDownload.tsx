import React, { useState } from "react";
import { allTrackers } from "services/track/track";
import ExcelClientDownload from "components/React/ExcelButton/ExcelClientDownload";
import { i18nFilter } from "filters/ngFilters";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const ExcelDownload = ({ excelLink, tooltipContentKey = "directives.csv.downloadCSV" }) => {
    const [excelDownloading, setExcelDownloading] = useState(false);
    const downloadExcel = async () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
        setExcelDownloading(true);
        try {
            await ExcelClientDownload(excelLink);
        } catch (e) {
        } finally {
            setExcelDownloading(false);
        }
    };
    return (
        <PlainTooltip placement="top" tooltipContent={i18nFilter()(tooltipContentKey)}>
            <div className="export-buttons-wrapper">
                <div data-automation="Download Excel">
                    <IconButton
                        isLoading={excelDownloading}
                        type="flat"
                        iconName="excel"
                        onClick={downloadExcel}
                    />
                </div>
            </div>
        </PlainTooltip>
    );
};
