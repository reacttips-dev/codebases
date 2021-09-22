import React, { useContext } from "react";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import BenchmarkCompetitorsList from "../BenchmarkCompetitorsList/BenchmarkCompetitorsList";
import { ConnectedProps } from "./CompetitorsListContainer";

export const CompetitorsList = ({
    similarWebsites,
    opportunityMode,
    greaterIsBetter,
}: {
    opportunityMode: string;
    greaterIsBetter: boolean;
} & ConnectedProps) => {
    const {
        isLoading,
        onAddCompetitor,
        onRemoveCompetitor,
        onUpdateCompetitor,
        benchmarkItemService,
    } = useContext(BenchmarkItemContext);
    return (
        <BenchmarkCompetitorsList
            opportunityMode={opportunityMode}
            greaterIsBetter={greaterIsBetter}
            updating={isLoading}
            competitors={benchmarkItemService.currentCompetitors}
            metric={benchmarkItemService.bResult.metric}
            country={benchmarkItemService.bResult.country}
            selectedWebsite={benchmarkItemService.prospect}
            similarWebsites={similarWebsites}
            onAddCompetitor={onAddCompetitor}
            onRemoveCompetitor={onRemoveCompetitor}
            onUpdateCompetitor={onUpdateCompetitor}
            metricFormatter={benchmarkItemService.defaultFormatter}
        />
    );
};
