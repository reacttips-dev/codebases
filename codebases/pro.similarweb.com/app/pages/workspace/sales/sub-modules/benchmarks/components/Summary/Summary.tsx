import React from "react";
import * as s from "../BenchmarkSummary/styles";
import SummaryAvgItemContainer from "../SummaryAvgItem/SummaryAvgItemContainer";
import SummaryProspectItemContainer from "../SummaryProspectItem/SummaryProspectItemContainer";
import SummaryOpportunityItemContainer from "../SummaryOpportunityItem/SummaryOpportunityItemContainer";

const Summary = () => {
    return (
        <s.StyledBenchmarkSummaryContainer>
            <s.StyledBenchmarkSummary>
                <SummaryProspectItemContainer />
                <SummaryAvgItemContainer />
                <SummaryOpportunityItemContainer />
            </s.StyledBenchmarkSummary>
        </s.StyledBenchmarkSummaryContainer>
    );
};

export default Summary;
