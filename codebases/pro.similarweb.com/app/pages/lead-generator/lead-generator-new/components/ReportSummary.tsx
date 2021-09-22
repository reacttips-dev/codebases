import * as React from "react";
import { FC } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    ReportSummaryBox,
    ReportSummaryHeader,
    ReportTitle,
    ReportSubtitle,
    ReportSummaryContent,
    ReportSummaryFooter,
} from "./elements";
import { i18nFilter } from "filters/ngFilters";
import LeadGeneratorRunButton from "../../components/LeadGeneratorRunButton";
import I18n from "../../../../components/React/Filters/I18n";

interface IReportSummaryProps {
    reportName: string;
    reportFilters: any[];
    onClickRun: () => void;
    onClickPreview: () => void;
    disableButtons: boolean;
    growContext?: boolean;
}

const ReportSummary: FC<IReportSummaryProps> = ({
    reportName,
    reportFilters,
    onClickRun,
    onClickPreview,
    disableButtons,
    growContext,
}) => {
    return (
        <ReportSummaryBox data-automation="lead-generator-summary-box">
            <ReportSummaryHeader growContext={growContext}>
                <ReportTitle>{reportName}</ReportTitle>
                <ReportSubtitle>
                    <I18n>grow.lead_generator.new.summary</I18n>
                </ReportSubtitle>
            </ReportSummaryHeader>
            <ReportSummaryContent>
                {reportFilters
                    .filter((filter) => !filter.hideInSummary)
                    .map((filter, index) => {
                        const SummaryComponent = filter.summaryComponent;
                        return (
                            <SummaryComponent key={index} filter={filter} filters={reportFilters} />
                        );
                    })}
            </ReportSummaryContent>
            <hr />
            <ReportSummaryFooter>
                <Button type="flat" onClick={onClickPreview} isDisabled={disableButtons}>
                    {i18nFilter()("grow.lead_generator.new.summary.preview")}
                </Button>
                <LeadGeneratorRunButton
                    onClick={onClickRun}
                    tooltipText={i18nFilter()("grow.lead_generator.new.summary.disable_run")}
                    buttonText={i18nFilter()("grow.lead_generator.new.summary.run")}
                    isDisabled={disableButtons}
                />
            </ReportSummaryFooter>
        </ReportSummaryBox>
    );
};

export default ReportSummary;
