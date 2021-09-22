import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import withSecondaryBarSet from "../../hoc/withSecondaryBarSet";
import withSWNavigator, { WithSWNavigatorProps } from "../../hoc/withSWNavigator";
import {
    createSearchThunk,
    fetchTechnologiesFiltersThunk,
} from "../../sub-modules/saved-searches/store/effects";
import {
    selectSearchCreating,
    selectReportResult,
    selectTechnologiesFilters,
} from "../../sub-modules/saved-searches/store/selectors";
import FindLeadsSearchPage from "./FindLeadsSearchPage";

const mapStateToProps = (state: RootState) => ({
    searchCreating: selectSearchCreating(state),
    reportResult: selectReportResult(state),
    technologiesFilters: selectTechnologiesFilters(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            createSearch: createSearchThunk,
            fetchTechnologiesFilters: fetchTechnologiesFiltersThunk,
        },
        dispatch,
    );
};

const FindLeadsSearchPageContainer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSecondaryBarSet("SalesIntelligenceFind"),
    withSWNavigator,
)(FindLeadsSearchPage) as React.ComponentType;

SWReactRootComponent(FindLeadsSearchPageContainer, "FindLeadsSearchPageContainer");

export type FindLeadsSearchPageContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;
export default FindLeadsSearchPageContainer;
