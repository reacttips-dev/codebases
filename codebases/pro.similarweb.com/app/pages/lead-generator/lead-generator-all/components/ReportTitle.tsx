import * as React from "react";
import { StatelessComponent } from "react";
import { PageTitlePlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { TitleContainer, NewDataLabel } from "./elements";
import { LeadGeneratorBoxTitle } from "../../components/elements";
import { i18nFilter } from "filters/ngFilters";
import LeadGeneratorTooltip from "../../components/LeadGeneratorTooltip";

interface IReportTitleProps {
    reportName: string;
    isNameLoading: boolean;
    newDataAvailable: boolean;
}

const ReportTitle: StatelessComponent<IReportTitleProps> = ({
    reportName,
    isNameLoading,
    newDataAvailable,
}) => {
    if (isNameLoading) {
        return (
            <TitleContainer newDataAvailable={false}>
                <PageTitlePlaceholderLoader />
            </TitleContainer>
        );
    }
    return (
        <TitleContainer newDataAvailable={newDataAvailable}>
            {reportName.length >= 45 ? (
                <LeadGeneratorTooltip text={i18nFilter()(reportName)}>
                    <LeadGeneratorBoxTitle>{reportName}</LeadGeneratorBoxTitle>
                </LeadGeneratorTooltip>
            ) : (
                <LeadGeneratorBoxTitle>{reportName}</LeadGeneratorBoxTitle>
            )}
            {newDataAvailable && (
                <NewDataLabel>{i18nFilter()("grow.lead_generator.all.new_data")}</NewDataLabel>
            )}
        </TitleContainer>
    );
};

export default ReportTitle;
