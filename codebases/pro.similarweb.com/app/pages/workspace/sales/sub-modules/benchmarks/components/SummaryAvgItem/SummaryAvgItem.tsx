import React from "react";
import { StyledSummaryAvgItem } from "./styles";
import { BenchmarkSummaryItemProps } from "../BenchmarkSummary/BenchmarkSummaryItem";

const SummaryAvgItem = (props: Omit<BenchmarkSummaryItemProps, "align" | "dataAutomation">) => {
    return (
        <StyledSummaryAvgItem
            align="center"
            dataAutomation="benchmark-summary-average"
            {...props}
        />
    );
};

export default SummaryAvgItem;
