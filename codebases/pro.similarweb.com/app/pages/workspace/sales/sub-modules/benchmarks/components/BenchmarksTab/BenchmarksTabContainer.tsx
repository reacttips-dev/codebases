import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "single-spa/store/types";
import BenchmarksTab from "./BenchmarksTab";
import {
    fetchSettingsThunkAction,
    fetchBenchmarksQuotaThunk,
    fetchBenchmarksThunkAction,
    fetchCountrySharesThunkAction,
    fetchCompetitorsThunkAction,
} from "../../store/effects";
import {
    selectBenchmarksFetching,
    selectSettingsFetching,
    selectSettings,
    selectCompetitorsUpdating,
    selectBenchmarksQuota,
    selectBenchmarksQuotaFetching,
    selectSettingsUpdating,
    selectBenchmarksAreEmpty,
} from "../../store/selectors";
import { setDomainTokenAction } from "../../store/action-creators";
import { withBenchmarksContext } from "../../hoc/withBenchmarksContext";
import { selectEmptyStateMessages } from "./selectors";

const mapStateToProps = (state: RootState) => ({
    settings: selectSettings(state),
    settingUpdating: selectSettingsUpdating(state),
    quota: selectBenchmarksQuota(state),
    quotaFetching: selectBenchmarksQuotaFetching(state),
    competitorsUpdating: selectCompetitorsUpdating(state),
    settingsFetching: selectSettingsFetching(state),
    benchmarksFetching: selectBenchmarksFetching(state),
    benchmarksAreEmpty: selectBenchmarksAreEmpty(state),
    emptyStateMessages: selectEmptyStateMessages(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchSettings: fetchSettingsThunkAction,
            fetchBenchmarks: fetchBenchmarksThunkAction,
            fetchBenchmarksQuota: fetchBenchmarksQuotaThunk,
            fetchCountryShares: fetchCountrySharesThunkAction,
            fetchCompetitors: fetchCompetitorsThunkAction,
            setDomainToken: setDomainTokenAction,
        },
        dispatch,
    );
};

export type BenchmarksTabContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withBenchmarksContext,
)(BenchmarksTab) as React.FC<{}>;
