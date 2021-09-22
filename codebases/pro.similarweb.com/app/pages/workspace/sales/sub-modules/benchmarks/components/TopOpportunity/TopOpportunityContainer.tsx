import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "single-spa/store/types";
import { withBenchmarksContext } from "../../hoc/withBenchmarksContext";
import { selectTopBenchmarkOrDefault, selectTopBenchmarkFetching } from "../../store/selectors";
import TopOpportunity from "./TopOpportunity";

type TopOpportunityContainerProps = { onViewAllClick(metricName: string): void };

const mapStateToProps = (state: RootState) => ({
    isLoading: selectTopBenchmarkFetching(state),
    topBenchmarkResult: selectTopBenchmarkOrDefault(state),
});

export default compose(connect(mapStateToProps), withBenchmarksContext)(TopOpportunity) as React.FC<
    TopOpportunityContainerProps
>;
