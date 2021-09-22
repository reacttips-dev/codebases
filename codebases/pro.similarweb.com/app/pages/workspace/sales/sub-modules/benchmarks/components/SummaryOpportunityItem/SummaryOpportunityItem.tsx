import React from "react";
import { StyledSummaryOpportunityItem } from "./styles";
import { BenchmarkSummaryItemProps } from "../BenchmarkSummary/BenchmarkSummaryItem";

const SummaryOpportunityItem = (
    props: Omit<BenchmarkSummaryItemProps, "align" | "dataAutomation">,
) => {
    return (
        <StyledSummaryOpportunityItem
            align="flex-end"
            dataAutomation="benchmark-summary-opportunity"
            {...props}
        />
    );
};

export default SummaryOpportunityItem;
