import React from "react";
import { connect } from "react-redux";
import SiteTrends from "./SiteTrends";
import {
    selectRouterCurrentModule,
    selectActiveListId,
    selectedCountryByOpportunityList,
} from "../../store/selectors";
import { RootState, ThunkDispatchCommon } from "single-spa/store/types";
import { bindActionCreators, compose } from "redux";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { selectCountryRightBar } from "pages/workspace/sales/sub-modules/common/store/selectors";
import { fetchDataForRightBarThunkAction } from "pages/workspace/sales/sub-modules/common/store/effects";
import {
    selectActiveTopic,
    selectSettings,
    selectTopicsFetching,
} from "../benchmarks/store/selectors";
import { selectOpportunityLists } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { SiteTrendsProps } from "./types";
import { updateBenchmarkSettingsThunkAction } from "../benchmarks/store/effects";
import { selectPreparedTopics } from "../../selectors";
import { selectSiteTrendsLoading } from "./store/selectors";
import { fetchSiteTrendsThunkAction } from "./store/effects";

const mapStateToProps = (state: RootState) => ({
    currentModule: selectRouterCurrentModule(state),
    selectedWebsite: selectActiveWebsite(state),
    selectedCountry: selectCountryRightBar(state),
    activeListId: selectActiveListId(state),
    opportunityListCountry: selectedCountryByOpportunityList(state),
    settings: selectSettings(state),
    opportunityLists: selectOpportunityLists(state),
    selectedTopic: selectActiveTopic(state),
    preparedTopics: selectPreparedTopics(state),
    topicsFetching: selectTopicsFetching(state),
    isSiteTrendsLoading: selectSiteTrendsLoading(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchDataForRightBar: fetchDataForRightBarThunkAction,
            fetchSiteTrends: fetchSiteTrendsThunkAction,
            updateBenchmarkSettings: updateBenchmarkSettingsThunkAction,
        },
        dispatch,
    );
};

export type SiteTrendsContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSWNavigator,
)(SiteTrends) as React.FC<SiteTrendsProps>;
