import React from "react";
import { BenchmarkResultType } from "../../types/benchmarks";
import { BaseWebsiteType } from "../../types/common";
import { StyledBenchmarksListContainer } from "./styles";
import { getUniqueBenchmarkId } from "../../helpers";
import NoCompetitorsFoundContainer from "pages/sales-intelligence/sub-modules/right-sidebar/components/NoCompetitorsFound/NoCompetitorsFoundContainer";
import ItemContainer from "../Item/ItemContainer";

type ItemsListProps = {
    selectedWebsite: BaseWebsiteType;
    benchmarkResults: BenchmarkResultType[];
};

const ItemsList = (props: ItemsListProps) => {
    const { benchmarkResults } = props;

    const renderBenchmarkItem = (bResult: BenchmarkResultType) => {
        const id = getUniqueBenchmarkId(bResult);

        return <ItemContainer key={id} benchmarkResult={bResult} />;
    };

    if (benchmarkResults.length === 0) {
        return <NoCompetitorsFoundContainer />;
    }

    return (
        <StyledBenchmarksListContainer>
            {benchmarkResults.map(renderBenchmarkItem)}
        </StyledBenchmarksListContainer>
    );
};

export default ItemsList;
