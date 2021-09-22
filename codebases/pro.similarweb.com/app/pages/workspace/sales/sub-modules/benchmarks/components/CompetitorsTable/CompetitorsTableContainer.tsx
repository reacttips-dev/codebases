import React from "react";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import { StyledBenchmarkTable } from "./styles";
import { getChartHeightByCompetitorsCount } from "../../helpers";
import useTableService from "../../hooks/useTableService";
import VisualizationLoader from "../VisualisationLoader/VisualisationLoader";
import CompetitorsTable from "./CompetitorsTable";

const CompetitorsTableContainer = () => {
    const { isLoading, benchmarkItemService } = React.useContext(BenchmarkItemContext);
    const table = useTableService();

    const renderedTableOrLoader = React.useMemo(() => {
        const competitorsCount = benchmarkItemService.currentCompetitors.length;
        const height = getChartHeightByCompetitorsCount(competitorsCount);

        if (isLoading) {
            return (
                <VisualizationLoader
                    height={height}
                    className={`loader-size-${competitorsCount}`}
                />
            );
        }

        return (
            <CompetitorsTable
                id={benchmarkItemService.id}
                data={table.getData()}
                columns={table.getColumns()}
            />
        );
    }, [table, benchmarkItemService]);

    return (
        <>
            <StyledBenchmarkTable>{renderedTableOrLoader}</StyledBenchmarkTable>
        </>
    );
};

export default CompetitorsTableContainer;
