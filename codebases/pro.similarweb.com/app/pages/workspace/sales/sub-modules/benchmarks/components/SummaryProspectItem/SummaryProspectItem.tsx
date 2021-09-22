import React from "react";
import { StyledSummaryProspectItem } from "./styles";
import { BenchmarkSummaryItemProps } from "../BenchmarkSummary/BenchmarkSummaryItem";

const SummaryProspectItem = (props: Omit<BenchmarkSummaryItemProps, "dataAutomation">) => {
    return <StyledSummaryProspectItem dataAutomation="benchmark-summary-prospect" {...props} />;
};

export default SummaryProspectItem;
