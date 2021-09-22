import React from "react";
import { StyledWebsitesListContainer, StyledTableVisualisationContainer } from "./styles";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import Summary from "../Summary/Summary";
import SummaryTextContainer from "../SummaryText/SummaryTextContainer";
import CompetitorsListContainer from "../CompetitorsList/CompetitorsListContainer";
import CompetitorsTableContainer from "../CompetitorsTable/CompetitorsTableContainer";
import { TableVisualizationProps } from "./types";

const TableVisualisation = ({
    selectedOpportunityMode,
    greaterIsBetter,
    prospectValue,
}: TableVisualizationProps): JSX.Element => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return (
        <>
            <StyledTableVisualisationContainer
                numberOfCompetitors={benchmarkItemService.currentCompetitors.length}
            >
                <StyledWebsitesListContainer>
                    <CompetitorsListContainer
                        greaterIsBetter={greaterIsBetter}
                        opportunityMode={selectedOpportunityMode}
                        prospectValue={prospectValue}
                        metricFormatter={benchmarkItemService.defaultFormatter}
                    />
                </StyledWebsitesListContainer>
                <CompetitorsTableContainer />
            </StyledTableVisualisationContainer>
            <Summary />
            <SummaryTextContainer />
        </>
    );
};

export default TableVisualisation;
