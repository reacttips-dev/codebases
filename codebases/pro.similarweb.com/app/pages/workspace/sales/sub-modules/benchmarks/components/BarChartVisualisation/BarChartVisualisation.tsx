import React from "react";
import { StyledWebsitesListContainer, StyledBarChartVisualisationContainer } from "./styles";
import BarChartContainer from "../BarChart/BarChartContainer";
import Summary from "../Summary/Summary";
import SummaryTextContainer from "../SummaryText/SummaryTextContainer";
import CompetitorsListContainer from "../CompetitorsList/CompetitorsListContainer";
import { BarChartVisualizationProps } from "./types";

const BarChartVisualisation = ({
    selectedOpportunityMode,
    greaterIsBetter,
    prospectValue,
}: BarChartVisualizationProps): JSX.Element => {
    return (
        <>
            <StyledBarChartVisualisationContainer>
                <StyledWebsitesListContainer>
                    <CompetitorsListContainer
                        greaterIsBetter={greaterIsBetter}
                        opportunityMode={selectedOpportunityMode}
                        prospectValue={prospectValue}
                    />
                </StyledWebsitesListContainer>
                <BarChartContainer />
            </StyledBarChartVisualisationContainer>
            <Summary />
            <SummaryTextContainer />
        </>
    );
};

export default BarChartVisualisation;
