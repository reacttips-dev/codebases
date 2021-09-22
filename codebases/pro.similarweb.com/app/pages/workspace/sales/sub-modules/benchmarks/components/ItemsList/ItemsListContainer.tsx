import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { selectActiveBenchmarkCategory, selectBenchmarks } from "../../store/selectors";
import { benchmarkResultHasCategory } from "../../helpers";
import { BenchmarkResultType } from "../../types/benchmarks";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import ItemsList from "./ItemsList";

type ItemsListContainerProps = {
    selectedCategory: string;
    benchmarkResults: BenchmarkResultType[];
};

const ItemsListContainer = (props: ItemsListContainerProps) => {
    const { selectedCategory, benchmarkResults } = props;
    const { website } = React.useContext(RightSidebarContext);
    const resultsMatchingCategory = benchmarkResults.filter(
        benchmarkResultHasCategory(selectedCategory),
    );

    return <ItemsList selectedWebsite={website} benchmarkResults={resultsMatchingCategory} />;
};

const mapStateToProps = (state: RootState) => ({
    benchmarkResults: selectBenchmarks(state),
    selectedCategory: selectActiveBenchmarkCategory(state),
});

export default connect(mapStateToProps, null)(ItemsListContainer) as React.FC<{}>;
