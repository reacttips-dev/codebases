import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import {
    fetchListRecommendationsThunk,
    dismissRecommendationThunk,
    addRecommendationsToListThunk,
} from "../../store/effects";
import { toggleRecommendationsBarAction } from "../../store/action-creators";
import withSWNavigator from "pages/sales-intelligence/hoc/withSWNavigator";
import RecommendationsSidebar from "./RecommendationsSidebar";
import {
    selectListRecommendations,
    selectListRecommendationsOpen,
    selectListRecommendationsFetching,
} from "../../store/selectors";

const mapStateToProps = (state: RootState) => ({
    recommendations: selectListRecommendations(state),
    recommendationsBarOpen: selectListRecommendationsOpen(state),
    recommendationsFetching: selectListRecommendationsFetching(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchListRecommendations: fetchListRecommendationsThunk,
            dismissRecommendation: dismissRecommendationThunk,
            addRecommendationsToList: addRecommendationsToListThunk,
            toggleRecommendationsBar: toggleRecommendationsBarAction,
        },
        dispatch,
    );
};

const RecommendationsSidebarContainer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSWNavigator,
)(RecommendationsSidebar) as React.FC<{}>;

export default RecommendationsSidebarContainer;
